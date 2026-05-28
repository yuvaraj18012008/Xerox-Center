// API Error handler
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Global error handler
export const handleError = (error, res) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
  }

  console.error('Unexpected error:', error);
  return res.status(500).json({
    success: false,
    message: 'Something went wrong. Please try again later.'
  });
};

// Async handler wrapper
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default AppError;
