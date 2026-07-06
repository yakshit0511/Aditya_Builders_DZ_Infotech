import SiteSettings from "../models/SiteSettings.js";
import catchAsync from "../utils/catchAsync.js";
import { cloudinary } from "../config/cloudinary.js";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/settings
// ─────────────────────────────────────────────────────────────────────────────
export const getSettings = catchAsync(async (req, res) => {
  const settings = await SiteSettings.getSettings();
  res.status(200).json({ success: true, data: settings });
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/settings
// ─────────────────────────────────────────────────────────────────────────────
export const updateSettings = catchAsync(async (req, res) => {
  const currentSettings = await SiteSettings.getSettings();
  const updates = { ...req.body };

  // Parse numbers and arrays from FormData
  if (updates.yearsOfExperience !== undefined) updates.yearsOfExperience = Number(updates.yearsOfExperience);
  if (updates.happyCustomers !== undefined) updates.happyCustomers = Number(updates.happyCustomers);
  if (updates.projectsCompleted !== undefined) updates.projectsCompleted = Number(updates.projectsCompleted);
  if (updates.mapLatitude !== undefined && updates.mapLatitude !== "") {
    updates.mapLatitude = Number(updates.mapLatitude);
  }
  if (updates.mapLongitude !== undefined && updates.mapLongitude !== "") {
    updates.mapLongitude = Number(updates.mapLongitude);
  }

  if (updates.phoneNumbers) {
    try {
      updates.phoneNumbers = JSON.parse(updates.phoneNumbers);
    } catch {
      updates.phoneNumbers = Array.isArray(updates.phoneNumbers)
        ? updates.phoneNumbers
        : updates.phoneNumbers.split(",").map((i) => i.trim()).filter(Boolean);
    }
  }

  // Handle corporate logo replacement in Cloudinary
  if (req.file) {
    if (currentSettings.logo && currentSettings.logo.publicId) {
      try {
        await cloudinary.uploader.destroy(currentSettings.logo.publicId);
      } catch (err) {
        console.warn("Failed to delete old site logo from Cloudinary:", err.message);
      }
    }
    updates.logo = { url: req.file.path, publicId: req.file.filename };
  }

  const settings = await SiteSettings.findOneAndUpdate(
    {}, // singleton match
    { $set: updates },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({ success: true, data: settings });
});
