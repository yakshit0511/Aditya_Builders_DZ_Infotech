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
import { uploadTestimonialPhoto } from "../config/multerStorage.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getTestimonials)
  .post(uploadTestimonialPhoto.single("customerPhoto"), createTestimonial);

router.route("/:id")
  .get(getTestimonial)
  .patch(uploadTestimonialPhoto.single("customerPhoto"), updateTestimonial)
  .delete(deleteTestimonial);

router.patch("/:id/approve", approveTestimonial);

export default router;
