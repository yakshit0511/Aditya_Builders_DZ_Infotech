import { body, param, validationResult } from "express-validator";
import TeamMember from "../models/TeamMember.js";
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

// GET /api/admin/team
export const getTeamMembers = catchAsync(async (req, res) => {
  const members = await TeamMember.find().sort({ displayOrder: 1, createdAt: 1 });
  res.status(200).json({ success: true, total: members.length, data: members });
});

// GET /api/admin/team/:id
export const getTeamMember = [
  mongoId(),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: "Team member not found" });
    res.status(200).json({ success: true, data: member });
  }),
];

// POST /api/admin/team
export const createTeamMember = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("designation").trim().notEmpty().withMessage("Designation is required"),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;

    const payload = { ...req.body };
    if (payload.displayOrder) payload.displayOrder = Number(payload.displayOrder);
    if (payload.isActive !== undefined) {
      payload.isActive = payload.isActive === "true" || payload.isActive === true;
    }

    // Attach photo if uploaded
    if (req.file) {
      payload.photo = { url: req.file.path, publicId: req.file.filename };
    }

    const member = await TeamMember.create(payload);
    res.status(201).json({ success: true, data: member });
  }),
];

// PATCH /api/admin/team/:id
export const updateTeamMember = [
  mongoId(),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;

    const updates = { ...req.body };
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: "Team member not found" });

    if (updates.displayOrder) updates.displayOrder = Number(updates.displayOrder);
    if (updates.isActive !== undefined) {
      updates.isActive = updates.isActive === "true" || updates.isActive === true;
    }

    // Handle photo replacement in Cloudinary
    if (req.file) {
      if (member.photo && member.photo.publicId) {
        try {
          await cloudinary.uploader.destroy(member.photo.publicId);
        } catch (err) {
          console.warn("Failed to delete old team member photo from Cloudinary:", err.message);
        }
      }
      updates.photo = { url: req.file.path, publicId: req.file.filename };
    }

    Object.assign(member, updates);
    await member.save();

    res.status(200).json({ success: true, data: member });
  }),
];

// DELETE /api/admin/team/:id  — soft delete + media cleanup
// Safety: Deactivates team member and destroys photo in Cloudinary to prevent orphaned media
export const deleteTeamMember = [
  mongoId(),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: "Team member not found" });

    // Clean up photo in Cloudinary
    if (member.photo && member.photo.publicId) {
      try {
        await cloudinary.uploader.destroy(member.photo.publicId);
      } catch (err) {
        console.warn("Failed to delete team member photo from Cloudinary on deactivation:", err.message);
      }
    }

    member.isActive = false;
    member.photo = { url: null, publicId: null };
    await member.save();

    res.status(200).json({ success: true, message: "Team member deactivated and Cloudinary media cleared", data: member });
  }),
];
