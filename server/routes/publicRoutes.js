import express from "express";
import rateLimit from "express-rate-limit";
import {
  getProjects,
  getProjectBySlug,
  getGalleryImages,
  getTestimonials,
  getTeamMembers,
  getSiteSettings,
  createInquiry,
} from "../controllers/publicController.js";

const router = express.Router();

// Stricter rate limit on inquiries submission — max 5 per hour per IP
const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many inquiries submitted from this IP. Please try again after an hour.",
  },
});

router.get("/projects", getProjects);
router.get("/projects/:slug", getProjectBySlug);
router.get("/gallery", getGalleryImages);
router.get("/testimonials", getTestimonials);
router.get("/team", getTeamMembers);
router.get("/settings", getSiteSettings);

// Public form submission with rate limiting
router.post("/inquiries", inquiryLimiter, createInquiry);

export default router;
