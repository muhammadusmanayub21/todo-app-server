/**
 * Global error handling middleware
 */
exports.errorHandler = (err, req, res, next) => {
    // Log error for debugging
    console.error('Error:', err);
  
    // Check if this is a Prisma error
    if (err.code && err.code.startsWith('P')) {
      return handlePrismaError(err, res);
    }
  
    // Default error response
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      error: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  };
  
  /**
   * Handle Prisma-specific errors with user-friendly messages
   */
  const handlePrismaError = (err, res) => {
    switch (err.code) {
      case 'P2002': // Unique constraint violation
        return res.status(409).json({
          error: `A record with this ${err.meta?.target || 'field'} already exists.`,
        });
      case 'P2025': // Record not found
        return res.status(404).json({
          error: 'The requested resource was not found.',
        });
      case 'P2003': // Foreign key constraint violation
        return res.status(400).json({
          error: 'Related record not found.',
        });
      default:
        return res.status(500).json({
          error: 'Database error occurred.',
          ...(process.env.NODE_ENV === 'development' && { details: err }),
        });
    }
  };