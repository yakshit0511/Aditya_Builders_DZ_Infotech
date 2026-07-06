import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getSettings,
  updateSettings,
} from "../controllers/adminSettingsController.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getSettings).patch(updateSettings);

export default router;
