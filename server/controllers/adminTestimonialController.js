import { body, param, validationResult } from "express-validator";
import Testimonial from "../models/Testimonial.js";
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

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/testimonials  — supports ?isApproved=true|false filter
// ─────────────────────────────────────────────────────────────────────────────
export const getTestimonials = catchAsync(async (req, res) => {
  const { isApproved, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (isApproved !== undefined) filter.isApproved = isApproved === "true";

  const skip  = (Number(page) - 1) * Number(limit);
  const total = await Testimonial.countDocuments(filter);
  const testimonials = await Testimonial.find(filter)
    .populate("relatedProject", "title slug")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({ success: true, total, page: Number(page), data: testimonials });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/testimonials/:id
// ─────────────────────────────────────────────────────────────────────────────
export const getTestimonial = [
  mongoId(),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;
    const t = await Testimonial.findById(req.params.id).populate("relatedProject", "title slug");
    if (!t) return res.status(404).json({ success: false, message: "Testimonial not found" });
    res.status(200).json({ success: true, data: t });
  }),
];

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/admin/testimonials
// ─────────────────────────────────────────────────────────────────────────────
export const createTestimonial = [
  body("customerName").trim().notEmpty().withMessage("Customer name is required"),
  body("message").trim().notEmpty().withMessage("Message is required"),
  body("relatedProject").optional().custom((val) => {
    if (val === "" || val === null || val === "null" || val === undefined) return true;
    if (/^[0-9a-fA-F]{24}$/.test(val)) return true;
    throw new Error("Invalid project ID format");
  }),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;

    const payload = { ...req.body };
    if (payload.rating) payload.rating = Number(payload.rating);
    if (payload.isApproved) payload.isApproved = payload.isApproved === "true" || payload.isApproved === true;
    if (payload.isFeatured) payload.isFeatured = payload.isFeatured === "true" || payload.isFeatured === true;

    if (payload.relatedProject === "" || payload.relatedProject === "null" || payload.relatedProject === "undefined") {
      payload.relatedProject = null;
    }

    // Attach customerPhoto if uploaded
    if (req.file) {
      payload.customerPhoto = { url: req.file.path, publicId: req.file.filename };
    }

    const t = await Testimonial.create(payload);
    res.status(201).json({ success: true, data: t });
  }),
];

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/testimonials/:id
// ─────────────────────────────────────────────────────────────────────────────
export const updateTestimonial = [
  mongoId(),
  body("relatedProject").optional().custom((val) => {
    if (val === "" || val === null || val === "null" || val === undefined) return true;
    if (/^[0-9a-fA-F]{24}$/.test(val)) return true;
    throw new Error("Invalid project ID format");
  }),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;

    const updates = { ...req.body };
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ success: false, message: "Testimonial not found" });

    if (updates.rating) updates.rating = Number(updates.rating);
    if (updates.isApproved !== undefined) {
      updates.isApproved = updates.isApproved === "true" || updates.isApproved === true;
    }
    if (updates.isFeatured !== undefined) {
      updates.isFeatured = updates.isFeatured === "true" || updates.isFeatured === true;
    }

    if (updates.relatedProject === "" || updates.relatedProject === "null" || updates.relatedProject === "undefined") {
      updates.relatedProject = null;
    }

    // Handle photo replacement in Cloudinary
    if (req.file) {
      if (testimonial.customerPhoto && testimonial.customerPhoto.publicId) {
        try {
          await cloudinary.uploader.destroy(testimonial.customerPhoto.publicId);
        } catch (err) {
          console.warn("Failed to delete old testimonial customer photo from Cloudinary:", err.message);
        }
      }
      updates.customerPhoto = { url: req.file.path, publicId: req.file.filename };
    }

    Object.assign(testimonial, updates);
    await testimonial.save();

    res.status(200).json({ success: true, data: testimonial });
  }),
];

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/admin/testimonials/:id  — hard delete + media cleanup
// ─────────────────────────────────────────────────────────────────────────────
export const deleteTestimonial = [
  mongoId(),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;
    const t = await Testimonial.findById(req.params.id);
    if (!t) return res.status(404).json({ success: false, message: "Testimonial not found" });

    // Clean up testimonial photo in Cloudinary
    if (t.customerPhoto && t.customerPhoto.publicId) {
      try {
        await cloudinary.uploader.destroy(t.customerPhoto.publicId);
      } catch (err) {
        console.warn("Failed to delete testimonial customer photo from Cloudinary on deletion:", err.message);
      }
    }

    await t.deleteOne();
    res.status(200).json({ success: true, message: "Testimonial deleted and Cloudinary media cleared" });
  }),
];

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/testimonials/:id/approve  — quick approve action
// ─────────────────────────────────────────────────────────────────────────────
export const approveTestimonial = [
  mongoId(),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;
    const t = await Testimonial.findById(req.params.id);
    if (!t) return res.status(404).json({ success: false, message: "Testimonial not found" });

    // Toggle approval state
    t.isApproved = !t.isApproved;
    await t.save();

    res.status(200).json({ success: true, message: `Testimonial approval set to ${t.isApproved}`, data: t });
  }),
];
