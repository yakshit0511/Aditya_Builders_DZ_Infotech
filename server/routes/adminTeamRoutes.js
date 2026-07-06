import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getTeamMembers,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "../controllers/adminTeamController.js";
import { uploadTeamPhoto } from "../config/multerStorage.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getTeamMembers)
  .post(uploadTeamPhoto.single("photo"), createTeamMember);

router.route("/:id")
  .get(getTeamMember)
  .patch(uploadTeamPhoto.single("photo"), updateTeamMember)
  .delete(deleteTeamMember);

export default router;
