import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * GalleryImage Schema
 * Represents a single photo in the site-wide public gallery
 * (separate from per-project galleries stored in Project.gallery).
 * Images are stored in Cloudinary; only the URL and publicId are persisted.
 */
const galleryImageSchema = new Schema(
  {
    /** Optional caption or label displayed below the image */
    title: {
      type: String,
      trim: true,
    },

    /**
     * Content category used for client-side filtering tabs.
     * Maps to visual filter buttons on the Gallery page.
     */
    category: {
      type: String,
      enum: [
        "Construction Progress",
        "Completed Project",
        "Interior",
        "Exterior",
        "Event",
        "Other",
      ],
      default: "Other",
    },

    /**
     * Cloudinary image — url for display, publicId for deletion/transforms.
     * Required: a gallery entry without an image has no purpose.
     */
    image: {
      url:      { type: String, required: [true, "Image URL is required"] },
      publicId: { type: String, required: [true, "Cloudinary publicId is required"] },
    },

    /**
     * Optional reference to an existing Project document.
     * When set, allows the frontend to deep-link gallery images back
     * to their associated project detail page.
     */
    relatedProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },

    /**
     * Soft-delete / visibility flag. Admin can hide individual images
     * without permanently deleting them from Cloudinary.
     */
    isActive: {
      type: Boolean,
      default: true,
    },

    /**
     * Controls the display order in the gallery grid.
     * Lower number = displayed first. Editable in the admin panel.
     */
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// ─── Indexes ───────────────────────────────────────────────────────────────────
galleryImageSchema.index({ category: 1, isActive: 1 }); // filter by category on gallery page
galleryImageSchema.index({ displayOrder: 1 });           // sort by admin-defined order

const GalleryImage = mongoose.model("GalleryImage", galleryImageSchema);
export default GalleryImage;
