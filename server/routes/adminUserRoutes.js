import express from "express";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../controllers/adminController.js";

const router = express.Router();

// All admin-user management routes: must be logged in AND be a superadmin
router.use(protect, restrictTo("superadmin"));

router.route("/").get(getAdmins).post(createAdmin);
router.route("/:id").patch(updateAdmin).delete(deleteAdmin);

export default router;
