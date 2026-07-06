import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getTeamMembers,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "../controllers/adminTeamController.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getTeamMembers).post(createTeamMember);
router.route("/:id").get(getTeamMember).patch(updateTeamMember).delete(deleteTeamMember);

export default router;
