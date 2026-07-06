import express from "express";
import { getProjects, getProjectBySlug } from "../controllers/publicProjectController.js";

const router = express.Router();

router.get("/", getProjects);
router.get("/:slug", getProjectBySlug);

export default router;
