import SiteSettings from "../models/SiteSettings.js";
import catchAsync from "../utils/catchAsync.js";

// Helper to strip logo publicId and compute mapEmbedUrl dynamically if not set
const sanitizeAndComputeSettings = (settings) => {
  if (!settings) return null;
  const s = settings.toObject ? settings.toObject() : settings;

  // Strip logo publicId
  if (s.logo) {
    s.logo = { url: s.logo.url };
  }

  // Compute mapEmbedUrl dynamically from lat/lng if not manually configured
  if (!s.mapEmbedUrl && s.mapLatitude && s.mapLongitude) {
    s.mapEmbedUrl = `https://www.google.com/maps?q=${s.mapLatitude},${s.mapLongitude}&output=embed`;
  }

  return s;
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/settings  — get public site settings with dynamic map coordinates
// ─────────────────────────────────────────────────────────────────────────────
export const getSettings = catchAsync(async (req, res) => {
  // getSettings() static method guarantees the document exists
  const settings = await SiteSettings.getSettings();
  const sanitizedSettings = sanitizeAndComputeSettings(settings);

  res.status(200).json({
    success: true,
    data: sanitizedSettings,
  });
});
