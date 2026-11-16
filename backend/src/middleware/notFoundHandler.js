/**
 * 404 Not Found Middleware
 * Catches any unmatched route and returns a clean, structured JSON response
 */
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Resource not found: cannot ${req.method} ${req.originalUrl}`,
  });
}

module.exports = notFoundHandler;
