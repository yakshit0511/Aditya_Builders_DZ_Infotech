import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getGalleryImages,
  getGalleryImage,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from "../controllers/adminGalleryController.js";
import { uploadSiteGallery } from "../config/multerStorage.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getGalleryImages)
  .post(uploadSiteGallery.single("image"), createGalleryImage);

router.route("/:id")
  .get(getGalleryImage)
  .patch(uploadSiteGallery.single("image"), updateGalleryImage)
  .delete(deleteGalleryImage);

export default router;
