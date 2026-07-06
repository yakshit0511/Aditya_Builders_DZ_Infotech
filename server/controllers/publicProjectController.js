import Project from "../models/Project.js";
import catchAsync from "../utils/catchAsync.js";

// Helper to strip publicId fields from a project object
const sanitizeProject = (project) => {
  if (!project) return null;
  
  // Convert mongoose doc to plain JS object to allow mutation
  const p = project.toObject ? project.toObject() : project;

  if (p.coverImage) {
    p.coverImage = { url: p.coverImage.url };
  }
  if (p.gallery && Array.isArray(p.gallery)) {
    p.gallery = p.gallery.map((img) => ({ url: img.url }));
  }

  return p;
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/projects  — list active projects with filters, sorting & pagination
// ─────────────────────────────────────────────────────────────────────────────
export const getProjects = catchAsync(async (req, res) => {
  const { status, type, featured, page = 1, limit = 9 } = req.query;

  // Build filter object - only show active projects publicly
  const filter = { isActive: true };
  if (status) filter.status = status;
  if (type) filter.type = type;
  if (featured === "true") filter.isFeatured = true;

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 9;
  const skip = (pageNum - 1) * limitNum;

  const total = await Project.countDocuments(filter);

  const projects = await Project.find(filter)
    .sort({ displayOrder: 1, createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  // Strip publicId fields from each project response
  const sanitizedProjects = projects.map(sanitizeProject);

  res.status(200).json({
    success: true,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    count: sanitizedProjects.length,
    data: sanitizedProjects,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/projects/:slug  — get single active project by slug
// ─────────────────────────────────────────────────────────────────────────────
export const getProjectBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params;

  const project = await Project.findOne({ slug, isActive: true });

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found or is currently inactive",
    });
  }

  const sanitizedProject = sanitizeProject(project);

  res.status(200).json({
    success: true,
    data: sanitizedProject,
  });
});
