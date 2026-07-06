import { body, param, validationResult } from "express-validator";
import GalleryImage from "../models/GalleryImage.js";
import catchAsync from "../utils/catchAsync.js";
import { cloudinary } from "../config/cloudinary.js";

const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
    return false;
  }
  return true;
};

const mongoId = (field = "id") =>
  param(field).isMongoId().withMessage(`Invalid ${field} format`);

const CATEGORIES = [
  "Construction Progress",
  "Completed Project",
  "Interior",
  "Exterior",
  "Event",
  "Other",
];

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/gallery  — supports ?category= filter
// ─────────────────────────────────────────────────────────────────────────────
export const getGalleryImages = catchAsync(async (req, res) => {
  const { category, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (category && CATEGORIES.includes(category)) filter.category = category;

  const skip  = (Number(page) - 1) * Number(limit);
  const total = await GalleryImage.countDocuments(filter);
  const images = await GalleryImage.find(filter)
    .populate("relatedProject", "title slug")
    .sort({ displayOrder: 1, createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({ success: true, total, page: Number(page), data: images });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/gallery/:id
// ─────────────────────────────────────────────────────────────────────────────
export const getGalleryImage = [
  mongoId(),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;
    const image = await GalleryImage.findById(req.params.id).populate("relatedProject", "title slug");
    if (!image) return res.status(404).json({ success: false, message: "Image not found" });
    res.status(200).json({ success: true, data: image });
  }),
];

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/admin/gallery
// ─────────────────────────────────────────────────────────────────────────────
export const createGalleryImage = [
  body("category").optional().isIn(CATEGORIES).withMessage("Invalid category"),
  body("relatedProject").optional().custom((val) => {
    if (val === "" || val === null || val === "null" || val === undefined) return true;
    if (/^[0-9a-fA-F]{24}$/.test(val)) return true;
    throw new Error("Invalid project ID format");
  }),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;

    const payload = { ...req.body };

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }

    payload.image = { url: req.file.path, publicId: req.file.filename };
    
    if (payload.relatedProject === "" || payload.relatedProject === "null" || payload.relatedProject === "undefined") {
      payload.relatedProject = null;
    }

    const image = await GalleryImage.create(payload);
    res.status(201).json({ success: true, data: image });
  }),
];

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/gallery/:id
// ─────────────────────────────────────────────────────────────────────────────
export const updateGalleryImage = [
  mongoId(),
  body("category").optional().isIn(CATEGORIES).withMessage("Invalid category"),
  body("relatedProject").optional().custom((val) => {
    if (val === "" || val === null || val === "null" || val === undefined) return true;
    if (/^[0-9a-fA-F]{24}$/.test(val)) return true;
    throw new Error("Invalid project ID format");
  }),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;

    const updates = { ...req.body };
    const image = await GalleryImage.findById(req.params.id);
    if (!image) return res.status(404).json({ success: false, message: "Image not found" });

    if (updates.relatedProject === "" || updates.relatedProject === "null" || updates.relatedProject === "undefined") {
      updates.relatedProject = null;
    }

    // Replace image file in Cloudinary if uploaded
    if (req.file) {
      if (image.image && image.image.publicId) {
        try {
          await cloudinary.uploader.destroy(image.image.publicId);
        } catch (err) {
          console.warn("Failed to delete old gallery image from Cloudinary:", err.message);
        }
      }
      updates.image = { url: req.file.path, publicId: req.file.filename };
    }

    Object.assign(image, updates);
    await image.save();

    res.status(200).json({ success: true, data: image });
  }),
];

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/admin/gallery/:id  — soft delete + media cleanup
// ─────────────────────────────────────────────────────────────────────────────
export const deleteGalleryImage = [
  mongoId(),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;
    const image = await GalleryImage.findById(req.params.id);
    if (!image) return res.status(404).json({ success: false, message: "Image not found" });

    // Clean up photo in Cloudinary
    if (image.image && image.image.publicId) {
      try {
        await cloudinary.uploader.destroy(image.image.publicId);
      } catch (err) {
        console.warn("Failed to delete gallery image from Cloudinary on deactivation:", err.message);
      }
    }

    image.isActive = false;
    image.image = { url: null, publicId: null };
    await image.save();

    res.status(200).json({ success: true, message: "Image deactivated and Cloudinary media cleared", data: image });
  }),
];
