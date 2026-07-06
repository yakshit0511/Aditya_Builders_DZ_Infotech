import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  approveTestimonial,
} from "../controllers/adminTestimonialController.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getTestimonials).post(createTestimonial);
router.route("/:id").get(getTestimonial).patch(updateTestimonial).delete(deleteTestimonial);
router.patch("/:id/approve", approveTestimonial);

export default router;
