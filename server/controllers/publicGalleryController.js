import GalleryImage from "../models/GalleryImage.js";
import catchAsync from "../utils/catchAsync.js";

// Helper to strip publicId fields from gallery image
const sanitizeImage = (img) => {
  if (!img) return null;
  const item = img.toObject ? img.toObject() : img;

  if (item.image) {
    item.image = { url: item.image.url };
  }

  return item;
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/gallery  — get active gallery images with category filter & pagination
// ─────────────────────────────────────────────────────────────────────────────
export const getGalleryImages = catchAsync(async (req, res) => {
  const { category, page = 1, limit = 12 } = req.query;

  const filter = { isActive: true };
  if (category) filter.category = category;

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 12;
  const skip = (pageNum - 1) * limitNum;

  const total = await GalleryImage.countDocuments(filter);

  const images = await GalleryImage.find(filter)
    .populate("relatedProject", "title slug")
    .sort({ displayOrder: 1, createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const sanitizedImages = images.map(sanitizeImage);

  res.status(200).json({
    success: true,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    count: sanitizedImages.length,
    data: sanitizedImages,
  });
});
