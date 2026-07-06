import express from "express";
import { getSettings } from "../controllers/publicSettingsController.js";

const router = express.Router();

router.get("/", getSettings);

export default router;
