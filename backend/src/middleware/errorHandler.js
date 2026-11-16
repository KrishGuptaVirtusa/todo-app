const config = require("../config/env");

/**
 * Centralized error handling middleware
 * Ensures no sensitive information or internal stack traces are leaked in production
 */
function errorHandler(err, req, res, next) {
  // Handle JSON parse errors from express.json()
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Malformed JSON payload in request body.",
      errors: [err.message],
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  const response = {
    success: false,
    message,
    ...(err.errors && { errors: err.errors }),
  };

  // Only include stack trace in non-production environments if explicitly not production
  if (!config.isProduction && err.stack) {
    response.stack = err.stack;
  }

  // Log error details on server side
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message || err);

  res.status(statusCode).json(response);
}

module.exports = errorHandler;
