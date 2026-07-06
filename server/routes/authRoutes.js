import express from "express";
import rateLimit from "express-rate-limit";
import { protect } from "../middleware/authMiddleware.js";
import {
  loginAdmin,
  logoutAdmin,
  getMe,
  changePassword,
} from "../controllers/authController.js";

const router = express.Router();

// ── Strict rate limiter for login — max 5 attempts per 15 min per IP ─────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please wait 15 minutes and try again.",
  },
});

// POST   /api/admin/auth/login
router.post("/login", loginLimiter, loginAdmin);

// POST   /api/admin/auth/logout
router.post("/logout", protect, logoutAdmin);

// GET    /api/admin/auth/me
router.get("/me", protect, getMe);

// PATCH  /api/admin/auth/change-password
router.patch("/change-password", protect, changePassword);

export default router;
