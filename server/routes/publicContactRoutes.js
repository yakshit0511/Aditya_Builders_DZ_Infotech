import express from "express";
import rateLimit from "express-rate-limit";
import { createInquiry } from "../controllers/publicContactController.js";

const router = express.Router();

// Stricter rate limiter — max 5 submissions per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many message submissions from this IP. Please try again after 15 minutes.",
  },
});

router.post("/", contactLimiter, createInquiry);

export default router;
