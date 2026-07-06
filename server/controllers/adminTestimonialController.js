import { body, param, validationResult } from "express-validator";
import Testimonial from "../models/Testimonial.js";
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
  body("rating").optional().isInt({ min: 1, max: 5 }).withMessage("Rating must be 1–5"),
  body("relatedProject").optional().isMongoId().withMessage("Invalid project ID"),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;
    const t = await Testimonial.create(req.body);
    res.status(201).json({ success: true, data: t });
  }),
];

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/testimonials/:id
// ─────────────────────────────────────────────────────────────────────────────
export const updateTestimonial = [
  mongoId(),
  body("rating").optional().isInt({ min: 1, max: 5 }).withMessage("Rating must be 1–5"),
  body("relatedProject").optional().isMongoId().withMessage("Invalid project ID"),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;
    const t = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!t) return res.status(404).json({ success: false, message: "Testimonial not found" });
    res.status(200).json({ success: true, data: t });
  }),
];

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/admin/testimonials/:id  — hard delete (no media attached)
// ─────────────────────────────────────────────────────────────────────────────
export const deleteTestimonial = [
  mongoId(),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;
    const t = await Testimonial.findByIdAndDelete(req.params.id);
    if (!t) return res.status(404).json({ success: false, message: "Testimonial not found" });
    res.status(200).json({ success: true, message: "Testimonial deleted" });
  }),
];

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/testimonials/:id/approve  — quick approve action
// ─────────────────────────────────────────────────────────────────────────────
export const approveTestimonial = [
  mongoId(),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;
    const t = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!t) return res.status(404).json({ success: false, message: "Testimonial not found" });
    res.status(200).json({ success: true, message: "Testimonial approved", data: t });
  }),
];
