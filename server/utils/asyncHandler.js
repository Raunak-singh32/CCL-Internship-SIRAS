/**
 * asyncHandler
 * Wraps async route handlers to catch errors and pass them to Express error middleware.
 * Eliminates the need for try-catch in every controller function.
 */

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;