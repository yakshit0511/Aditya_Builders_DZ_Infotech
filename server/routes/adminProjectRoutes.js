import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  restoreProject,
  toggleFeature,
} from "../controllers/adminProjectController.js";

const router = express.Router();

// All routes protected — require valid admin_token cookie
router.use(protect);

router.route("/").get(getProjects).post(createProject);
router.route("/:id").get(getProject).patch(updateProject).delete(deleteProject);
router.patch("/:id/restore", restoreProject);
router.patch("/:id/feature", toggleFeature);

export default router;
