import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getGalleryImages,
  getGalleryImage,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from "../controllers/adminGalleryController.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getGalleryImages).post(createGalleryImage);
router.route("/:id").get(getGalleryImage).patch(updateGalleryImage).delete(deleteGalleryImage);

export default router;
