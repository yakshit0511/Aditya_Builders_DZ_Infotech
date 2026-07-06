/**
 * emailService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Transactional email service module stub.
 *
 * For now, this module logs to the console as a placeholder.
 * Full integration with Resend.com will happen in Phase 7.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * sendContactNotificationEmail
 * Sends a notification email to the administrator when a new contact inquiry
 * is submitted on the website.
 *
 * @param {Object} inquiry - The ContactInquiry document from Mongoose
 * @returns {Promise<void>}
 */
export const sendContactNotificationEmail = async (inquiry) => {
  // TODO: Phase 7 - integrate Resend (send email notifications to NOTIFY_EMAIL_TO)
  console.log("✉️  [Email Service Stub] Email notification would be sent here:");
  console.log(`   - To: ${process.env.NOTIFY_EMAIL_TO || "admin@adityabuilders.in"}`);
  console.log(`   - Subject: New Website Lead: ${inquiry.subject || "No Subject"}`);
  console.log(`   - From: ${inquiry.name} <${inquiry.email}>`);
  console.log(`   - Phone: ${inquiry.phone}`);
  console.log(`   - Message: "${inquiry.message}"`);
  console.log(`   - Source: ${inquiry.source}`);
  if (inquiry.interestedProject) {
    console.log(`   - Interested Project ID: ${inquiry.interestedProject}`);
  }
};
