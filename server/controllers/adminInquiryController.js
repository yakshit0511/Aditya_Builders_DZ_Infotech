import { body, param, validationResult } from "express-validator";
import ContactInquiry from "../models/ContactInquiry.js";
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
// GET /api/admin/inquiries  — supports ?status= filter, sorted newest first
// ─────────────────────────────────────────────────────────────────────────────
export const getInquiries = catchAsync(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status && ["New", "Contacted", "Closed"].includes(status)) {
    filter.status = status;
  }

  const skip  = (Number(page) - 1) * Number(limit);
  const total = await ContactInquiry.countDocuments(filter);
  const inquiries = await ContactInquiry.find(filter)
    .populate("interestedProject", "title slug")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({ success: true, total, page: Number(page), data: inquiries });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/inquiries/:id
// ─────────────────────────────────────────────────────────────────────────────
export const getInquiry = [
  mongoId(),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;
    const inquiry = await ContactInquiry.findById(req.params.id).populate(
      "interestedProject",
      "title slug"
    );
    if (!inquiry) return res.status(404).json({ success: false, message: "Inquiry not found" });
    res.status(200).json({ success: true, data: inquiry });
  }),
];

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/inquiries/:id/status  — update workflow status & internal notes
// ─────────────────────────────────────────────────────────────────────────────
export const updateInquiryStatus = [
  mongoId(),
  body("status")
    .optional()
    .isIn(["New", "Contacted", "Closed"])
    .withMessage("Status must be New, Contacted, or Closed"),
  body("internalNotes")
    .optional()
    .isString()
    .withMessage("Internal notes must be a string"),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;

    const updateFields = {};
    if (req.body.status !== undefined) updateFields.status = req.body.status;
    if (req.body.internalNotes !== undefined) updateFields.internalNotes = req.body.internalNotes;

    const inquiry = await ContactInquiry.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );
    if (!inquiry) return res.status(404).json({ success: false, message: "Inquiry not found" });
    res.status(200).json({ success: true, data: inquiry });
  }),
];

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/admin/inquiries/:id  — hard delete + Cloudinary attachments cleanup
// ─────────────────────────────────────────────────────────────────────────────
export const deleteInquiry = [
  mongoId(),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;
    
    const inquiry = await ContactInquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: "Inquiry not found" });

    // Clean up photo attachments from Cloudinary on delete
    if (inquiry.attachments && inquiry.attachments.length > 0) {
      for (const att of inquiry.attachments) {
        if (att.publicId) {
          try {
            await cloudinary.uploader.destroy(att.publicId);
          } catch (err) {
            console.warn(`Failed to delete inquiry attachment ${att.publicId} from Cloudinary:`, err.message);
          }
        }
      }
    }

    await inquiry.deleteOne();
    res.status(200).json({ success: true, message: "Inquiry deleted and Cloudinary attachments cleared" });
  }),
];
