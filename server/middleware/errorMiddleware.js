/**
 * errorMiddleware.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralised Express error handling.
 * Mount these TWO middlewares LAST in server.js, after all routes.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * notFound — Catch-all for any request that didn't match a defined route.
 * Express calls this when no route handler sent a response.
 */
export const notFound = (req, res, next) => {
  const err = new Error(`Route not found: ${req.originalUrl}`);
  err.status = 404;
  next(err);
};

/**
 * globalErrorHandler — Unified error response formatter.
 *
 * Handles the following error types with friendly messages:
 *   - Mongoose ValidationError   → 400 with field-level error list
 *   - Mongoose CastError         → 400 "Invalid ID format"
 *   - MongoDB duplicate key (11000) → 409 "already exists"
 *   - JWT JsonWebTokenError      → 401 "Invalid token"
 *   - JWT TokenExpiredError      → 401 "Session expired"
 *   - Everything else            → 500 Internal Server Error
 *
 * In development: includes error.stack for debugging.
 * In production:  hides stack traces from the response.
 *
 * Always returns: { success: false, message: "...", errors?: [...] }
 *
 * @param {Error}    err
 * @param {Request}  req
 * @param {Response} res
 * @param {Function} next - must be declared even if unused (Express 4-arg signature)
 */
// eslint-disable-next-line no-unused-vars
export const globalErrorHandler = (err, req, res, next) => {
  let statusCode = err.status || err.statusCode || 500;
  let message    = err.message || "Internal Server Error";
  let errors     = undefined;

  // ── Mongoose Validation Error (schema-level validation failures) ───────────
  if (err.name === "ValidationError") {
    statusCode = 400;
    message    = "Validation failed";
    errors     = Object.values(err.errors).map((e) => ({
      field:   e.path,
      message: e.message,
    }));
  }

  // ── Mongoose CastError (invalid ObjectId format in URL params) ────────────
  else if (err.name === "CastError") {
    statusCode = 400;
    message    = `Invalid value for field "${err.path}": ${err.value}`;
  }

  // ── MongoDB Duplicate Key Error ────────────────────────────────────────────
  else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    const value = err.keyValue?.[field] || "";
    message     = `"${value}" is already in use for ${field}. Please use a different value.`;
  }

  // ── JWT Errors ─────────────────────────────────────────────────────────────
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message    = "Invalid authentication token. Please log in again.";
  }
  else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message    = "Session expired. Please log in again.";
  }

  // ── Build response ─────────────────────────────────────────────────────────
  const response = { success: false, message };
  if (errors)                                       response.errors = errors;
  if (process.env.NODE_ENV !== "production" && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
