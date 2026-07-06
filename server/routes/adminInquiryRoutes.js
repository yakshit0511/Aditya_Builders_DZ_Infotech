import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getInquiries,
  getInquiry,
  updateInquiryStatus,
  deleteInquiry,
} from "../controllers/adminInquiryController.js";

const router = express.Router();

router.use(protect);

// No POST — inquiries created via public contact form only (Phase 4)
router.get("/", getInquiries);
router.get("/:id", getInquiry);
router.patch("/:id/status", updateInquiryStatus);
router.delete("/:id", deleteInquiry);

export default router;
