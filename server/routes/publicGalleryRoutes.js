import express from "express";
import { getGalleryImages } from "../controllers/publicGalleryController.js";

const router = express.Router();

router.get("/", getGalleryImages);

export default router;
