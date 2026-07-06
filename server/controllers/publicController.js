import { body, validationResult } from "express-validator";
import Project from "../models/Project.js";
import GalleryImage from "../models/GalleryImage.js";
import Testimonial from "../models/Testimonial.js";
import TeamMember from "../models/TeamMember.js";
import SiteSettings from "../models/SiteSettings.js";
import ContactInquiry from "../models/ContactInquiry.js";
import catchAsync from "../utils/catchAsync.js";

// Helper for express-validator
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

// ─── 1. Get Projects ─────────────────────────────────────────────────────────
export const getProjects = catchAsync(async (req, res) => {
  const { status, type } = req.query;

  // Public queries only show ACTIVE projects
  const filter = { isActive: true };
  if (status) filter.status = status;
  if (type) filter.type = type;

  const projects = await Project.find(filter)
    .sort({ displayOrder: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects,
  });
});

// ─── 2. Get Project by Slug ──────────────────────────────────────────────────
export const getProjectBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params;

  const project = await Project.findOne({ slug, isActive: true });

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
    });
  }

  res.status(200).json({
    success: true,
    data: project,
  });
});

// ─── 3. Get Gallery Images ───────────────────────────────────────────────────
export const getGalleryImages = catchAsync(async (req, res) => {
  const { category } = req.query;

  const filter = { isActive: true };
  if (category) filter.category = category;

  const images = await GalleryImage.find(filter)
    .populate("relatedProject", "title slug")
    .sort({ displayOrder: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: images.length,
    data: images,
  });
});

// ─── 4. Get Testimonials ────────────────────────────────────────────────────
export const getTestimonials = catchAsync(async (req, res) => {
  const { featured } = req.query;

  // Public queries only show APPROVED testimonials
  const filter = { isApproved: true };
  if (featured === "true") filter.isFeatured = true;

  const testimonials = await Testimonial.find(filter)
    .populate("relatedProject", "title slug")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: testimonials.length,
    data: testimonials,
  });
});

// ─── 5. Get Team Members ─────────────────────────────────────────────────────
export const getTeamMembers = catchAsync(async (req, res) => {
  const members = await TeamMember.find({ isActive: true })
    .sort({ displayOrder: 1, createdAt: 1 });

  res.status(200).json({
    success: true,
    count: members.length,
    data: members,
  });
});

// ─── 6. Get Site Settings ────────────────────────────────────────────────────
export const getSiteSettings = catchAsync(async (req, res) => {
  const settings = await SiteSettings.getSettings();
  res.status(200).json({
    success: true,
    data: settings,
  });
});

// ─── 7. Create Inquiry (Public Form submission) ──────────────────────────────
export const inquiryValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("phone").trim().notEmpty().withMessage("Phone number is required"),
  body("message").trim().notEmpty().withMessage("Message is required"),
  body("interestedProject").optional().isMongoId().withMessage("Invalid project ID"),
  body("source")
    .optional()
    .isIn(["Website Contact Form", "Project Enquiry", "Other"])
    .withMessage("Invalid inquiry source"),
];

export const createInquiry = [
  ...inquiryValidation,
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;

    const inquiry = await ContactInquiry.create(req.body);

    // Future feature notice: In Phase 7, Resend email notifications can be sent from here.
    res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
      data: inquiry,
    });
  }),
];
