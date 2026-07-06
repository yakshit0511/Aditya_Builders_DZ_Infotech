import TeamMember from "../models/TeamMember.js";
import catchAsync from "../utils/catchAsync.js";

// Helper to strip publicId fields from team member photo
const sanitizeMember = (m) => {
  if (!m) return null;
  const item = m.toObject ? m.toObject() : m;

  if (item.photo) {
    item.photo = { url: item.photo.url };
  }

  return item;
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/team  — get active team members sorted by displayOrder
// ─────────────────────────────────────────────────────────────────────────────
export const getTeamMembers = catchAsync(async (req, res) => {
  const members = await TeamMember.find({ isActive: true })
    .sort({ displayOrder: 1, createdAt: 1 });

  const sanitizedMembers = members.map(sanitizeMember);

  res.status(200).json({
    success: true,
    count: sanitizedMembers.length,
    data: sanitizedMembers,
  });
});
