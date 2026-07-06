import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getSettings,
  updateSettings,
} from "../controllers/adminSettingsController.js";
import { uploadSiteLogo } from "../config/multerStorage.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getSettings)
  .patch(uploadSiteLogo.single("logo"), updateSettings);

export default router;
