import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * TeamMember Schema
 * Represents a staff member or key person shown in the "Meet the Team"
 * or leadership section of the About page.
 * Managed entirely from the admin panel.
 */
const teamMemberSchema = new Schema(
  {
    /** Full name displayed publicly */
    name: {
      type: String,
      required: [true, "Team member name is required"],
      trim: true,
    },

    /** Job title or role, e.g. "Founder & Director", "Site Engineer" */
    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true,
    },

    /**
     * Professional headshot stored in Cloudinary.
     * url      — CDN URL for the <img> src.
     * publicId — Cloudinary public_id for deletion when the photo is replaced.
     * Falls back to a placeholder avatar on the frontend if null.
     */
    photo: {
      url:      { type: String, default: null },
      publicId: { type: String, default: null },
    },

    /** Short professional biography shown below the designation */
    bio: {
      type: String,
      trim: true,
    },

    /**
     * Defines the left-to-right display order in the team grid.
     * Lower number = shown first. Admin can reorder via drag-and-drop in Phase 3.
     */
    displayOrder: {
      type: Number,
      default: 0,
    },

    /**
     * Soft-delete / hide flag. Admin can remove a team member from
     * public view without deleting the document.
     */
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ─── Index ─────────────────────────────────────────────────────────────────────
teamMemberSchema.index({ displayOrder: 1, isActive: 1 }); // ordered list of active members

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);
export default TeamMember;
