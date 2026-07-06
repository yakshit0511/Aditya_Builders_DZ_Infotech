import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * Testimonial Schema
 * Stores customer reviews and feedback for display on the website.
 * Admin approval is required before a testimonial is shown publicly
 * (isApproved: false by default — prevents spam/abuse).
 */
const testimonialSchema = new Schema(
  {
    /** Full name of the customer as it will appear on the website */
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },

    /**
     * Optional customer photo (headshot).
     * url      — Cloudinary CDN URL for display.
     * publicId — Cloudinary public_id for deletion when updating photo.
     * Falls back to a generated avatar / initials on the frontend.
     */
    customerPhoto: {
      url:      { type: String, default: null },
      publicId: { type: String, default: null },
    },

    /** Name of the project the customer purchased / is associated with (free text) */
    projectName: {
      type: String,
      trim: true,
    },

    /**
     * Optional FK reference to the Project document.
     * Enables deep-linking the testimonial to the project detail page.
     */
    relatedProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },

    /**
     * Star rating from 1–5.
     * Validated at schema level so invalid ratings are rejected.
     */
    rating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
      default: 5,
    },

    /** The customer's review text shown on the website */
    message: {
      type: String,
      required: [true, "Testimonial message is required"],
      trim: true,
    },

    /**
     * Moderation gate — admin must set this to true for the testimonial
     * to appear on the public site. New submissions default to false.
     */
    isApproved: {
      type: Boolean,
      default: false,
    },

    /**
     * If true, this testimonial is promoted to the homepage
     * "What Our Customers Say" section. Admin-controlled.
     */
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ─── Indexes ───────────────────────────────────────────────────────────────────
testimonialSchema.index({ isApproved: 1, isFeatured: 1 }); // public query filter
testimonialSchema.index({ createdAt: -1 });                 // most recent first

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
export default Testimonial;
