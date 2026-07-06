import { body, param, validationResult } from "express-validator";
import TeamMember from "../models/TeamMember.js";
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
    const member = await TeamMember.create(req.body);
    res.status(201).json({ success: true, data: member });
  }),
];

// PATCH /api/admin/team/:id
export const updateTeamMember = [
  mongoId(),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;
    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!member) return res.status(404).json({ success: false, message: "Team member not found" });
    res.status(200).json({ success: true, data: member });
  }),
];

// DELETE /api/admin/team/:id  — soft delete
// NOTE: Hard deletion + Cloudinary photo cleanup deferred to Phase 7
export const deleteTeamMember = [
  mongoId(),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;
    const member = await TeamMember.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!member) return res.status(404).json({ success: false, message: "Team member not found" });
    res.status(200).json({ success: true, message: "Team member deactivated", data: member });
  }),
];
