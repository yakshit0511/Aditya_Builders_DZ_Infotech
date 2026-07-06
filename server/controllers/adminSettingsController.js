import SiteSettings from "../models/SiteSettings.js";
import catchAsync from "../utils/catchAsync.js";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/settings
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Returns the singleton SiteSettings document.
 * Uses the getSettings() static method which auto-creates the document
 * with defaults if it doesn't exist yet — the app never returns 404 here.
 */
export const getSettings = catchAsync(async (req, res) => {
  const settings = await SiteSettings.getSettings();
  res.status(200).json({ success: true, data: settings });
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/settings
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Updates the singleton SiteSettings document.
 * Uses findOneAndUpdate with upsert: true — if no document exists yet,
 * it creates one (defensive fallback, getSettings() normally handles this).
 * Only fields included in req.body are updated (partial update).
 */
export const updateSettings = catchAsync(async (req, res) => {
  const settings = await SiteSettings.findOneAndUpdate(
    {},                    // singleton — match the only document
    { $set: req.body },
    { new: true, upsert: true, runValidators: true }
  );
  res.status(200).json({ success: true, data: settings });
});
