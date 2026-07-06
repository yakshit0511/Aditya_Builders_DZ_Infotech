import express from "express";
import { getTestimonials } from "../controllers/publicTestimonialController.js";

const router = express.Router();

router.get("/", getTestimonials);

export default router;
