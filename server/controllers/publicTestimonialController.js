import Testimonial from "../models/Testimonial.js";
import catchAsync from "../utils/catchAsync.js";

// Helper to strip publicId fields from testimonial customer photo
const sanitizeTestimonial = (t) => {
  if (!t) return null;
  const item = t.toObject ? t.toObject() : t;

  if (item.customerPhoto) {
    item.customerPhoto = { url: item.customerPhoto.url };
  }

  return item;
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/testimonials  — get approved testimonials only (never unapproved ones)
// ─────────────────────────────────────────────────────────────────────────────
export const getTestimonials = catchAsync(async (req, res) => {
  const { featured } = req.query;

  // Build filter - CRITICAL: only show isApproved: true reviews publicly
  const filter = { isApproved: true };
  if (featured === "true") {
    filter.isFeatured = true;
  }

  const testimonials = await Testimonial.find(filter)
    .populate("relatedProject", "title slug")
    .sort({ createdAt: -1 });

  const sanitizedTestimonials = testimonials.map(sanitizeTestimonial);

  res.status(200).json({
    success: true,
    count: sanitizedTestimonials.length,
    data: sanitizedTestimonials,
  });
});
