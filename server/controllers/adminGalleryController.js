import { body, param, validationResult } from "express-validator";
import GalleryImage from "../models/GalleryImage.js";
import catchAsync from "../utils/catchAsync.js";

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
  body("image.url").notEmpty().withMessage("Image URL is required"),
  body("image.publicId").notEmpty().withMessage("Image publicId is required"),
  body("category").optional().isIn(CATEGORIES).withMessage("Invalid category"),
  body("relatedProject").optional().isMongoId().withMessage("Invalid project ID"),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;
    const image = await GalleryImage.create(req.body);
    res.status(201).json({ success: true, data: image });
  }),
];

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/gallery/:id
// ─────────────────────────────────────────────────────────────────────────────
export const updateGalleryImage = [
  mongoId(),
  body("category").optional().isIn(CATEGORIES).withMessage("Invalid category"),
  body("relatedProject").optional().isMongoId().withMessage("Invalid project ID"),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;
    const image = await GalleryImage.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!image) return res.status(404).json({ success: false, message: "Image not found" });
    res.status(200).json({ success: true, data: image });
  }),
];

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/admin/gallery/:id  — soft delete
// NOTE: Hard deletion + Cloudinary cleanup deferred to Phase 7
// ─────────────────────────────────────────────────────────────────────────────
export const deleteGalleryImage = [
  mongoId(),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;
    const image = await GalleryImage.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!image) return res.status(404).json({ success: false, message: "Image not found" });
    res.status(200).json({ success: true, message: "Image deactivated", data: image });
  }),
];
