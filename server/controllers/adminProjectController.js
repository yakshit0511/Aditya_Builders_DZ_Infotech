import { body, param, query, validationResult } from "express-validator";
import Project from "../models/Project.js";
import catchAsync from "../utils/catchAsync.js";

// ─── Validation helpers ───────────────────────────────────────────────────────
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

export const projectValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("status")
    .isIn(["Ongoing", "Completed", "Upcoming"])
    .withMessage("Status must be Ongoing, Completed, or Upcoming"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("type")
    .optional()
    .isIn(["Residential", "Commercial", "Residential + Commercial"])
    .withMessage("Invalid project type"),
];

// ─── Slug generator ───────────────────────────────────────────────────────────
const toSlug = (str) =>
  str.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/projects  — paginated list, supports ?status= ?type= ?page= ?limit=
// ─────────────────────────────────────────────────────────────────────────────
export const getProjects = catchAsync(async (req, res) => {
  const { status, type, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (type)   filter.type = type;

  const skip  = (Number(page) - 1) * Number(limit);
  const total = await Project.countDocuments(filter);
  const projects = await Project.find(filter)
    .sort({ displayOrder: 1, createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: projects,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/projects/:id
// ─────────────────────────────────────────────────────────────────────────────
export const getProject = [
  mongoId(),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    res.status(200).json({ success: true, data: project });
  }),
];

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/admin/projects
// ─────────────────────────────────────────────────────────────────────────────
export const createProject = [
  ...projectValidation,
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;

    const body = req.body;

    // Auto-generate slug from title if not provided
    if (!body.slug) body.slug = toSlug(body.title);

    // Ensure slug uniqueness
    const existing = await Project.findOne({ slug: body.slug });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Slug "${body.slug}" already exists. Provide a unique slug.`,
      });
    }

    const project = await Project.create(body);
    res.status(201).json({ success: true, data: project });
  }),
];

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/projects/:id
// ─────────────────────────────────────────────────────────────────────────────
export const updateProject = [
  mongoId(),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;

    const updates = req.body;

    // Re-generate slug if title changed and no explicit slug given
    if (updates.title && !updates.slug) {
      updates.slug = toSlug(updates.title);
    }

    // Check slug uniqueness (exclude current doc)
    if (updates.slug) {
      const conflict = await Project.findOne({
        slug: updates.slug,
        _id: { $ne: req.params.id },
      });
      if (conflict) {
        return res.status(409).json({
          success: false,
          message: `Slug "${updates.slug}" is already taken by another project.`,
        });
      }
    }

    const project = await Project.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    res.status(200).json({ success: true, data: project });
  }),
];

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/admin/projects/:id  — soft delete (isActive: false)
// NOTE: Hard deletion + Cloudinary image cleanup deferred to Phase 7
// ─────────────────────────────────────────────────────────────────────────────
export const deleteProject = [
  mongoId(),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    res.status(200).json({ success: true, message: "Project deactivated", data: project });
  }),
];

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/projects/:id/restore
// ─────────────────────────────────────────────────────────────────────────────
export const restoreProject = [
  mongoId(),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    res.status(200).json({ success: true, message: "Project restored", data: project });
  }),
];

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/projects/:id/feature  — toggle isFeatured
// ─────────────────────────────────────────────────────────────────────────────
export const toggleFeature = [
  mongoId(),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    project.isFeatured = !project.isFeatured;
    await project.save();

    res.status(200).json({
      success: true,
      message: `Project ${project.isFeatured ? "featured" : "unfeatured"}`,
      data: project,
    });
  }),
];
