import { body, param, validationResult } from "express-validator";
import Admin from "../models/Admin.js";
import catchAsync from "../utils/catchAsync.js";

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

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/admins  — SUPERADMIN ONLY
// ─────────────────────────────────────────────────────────────────────────────
export const getAdmins = catchAsync(async (req, res) => {
  // password is excluded by default (select: false in schema)
  const admins = await Admin.find().sort({ createdAt: 1 });
  res.status(200).json({ success: true, total: admins.length, data: admins });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/admin/admins  — SUPERADMIN ONLY
// ─────────────────────────────────────────────────────────────────────────────
export const createAdmin = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("role")
    .optional()
    .isIn(["superadmin", "editor"])
    .withMessage("Role must be superadmin or editor"),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;
    // Pre-save hook hashes the password automatically
    const admin = await Admin.create(req.body);
    res.status(201).json({
      success: true,
      data: {
        id:        admin._id,
        name:      admin.name,
        email:     admin.email,
        role:      admin.role,
        createdAt: admin.createdAt,
      },
    });
  }),
];

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/admins/:id  — SUPERADMIN ONLY
// ─────────────────────────────────────────────────────────────────────────────
export const updateAdmin = [
  mongoId(),
  body("email").optional().isEmail().withMessage("Valid email required").normalizeEmail(),
  body("role")
    .optional()
    .isIn(["superadmin", "editor"])
    .withMessage("Role must be superadmin or editor"),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;

    // Disallow password changes via this route — use /change-password instead
    const { password, ...updates } = req.body;
    if (password) {
      return res.status(400).json({
        success: false,
        message: "Use PATCH /api/admin/auth/change-password to update passwords",
      });
    }

    const admin = await Admin.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });

    res.status(200).json({
      success: true,
      data: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  }),
];

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/admin/admins/:id  — SUPERADMIN ONLY
// Safety checks:
//   1. Cannot delete your own account
//   2. Cannot delete the last remaining superadmin (would lock everyone out)
// ─────────────────────────────────────────────────────────────────────────────
export const deleteAdmin = [
  mongoId(),
  catchAsync(async (req, res) => {
    if (!validate(req, res)) return;

    // Check 1: prevent self-deletion
    if (req.params.id === req.admin._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account",
      });
    }

    const target = await Admin.findById(req.params.id);
    if (!target) return res.status(404).json({ success: false, message: "Admin not found" });

    // Check 2: prevent deleting the last superadmin
    if (target.role === "superadmin") {
      const superadminCount = await Admin.countDocuments({ role: "superadmin" });
      if (superadminCount <= 1) {
        return res.status(400).json({
          success: false,
          message:
            "Cannot delete the last superadmin account — the system would be unmanageable. Promote another admin to superadmin first.",
        });
      }
    }

    await target.deleteOne();
    res.status(200).json({ success: true, message: "Admin account deleted" });
  }),
];
