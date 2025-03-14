const { validationResult } = require('express-validator');

/**
 * Middleware to validate request data using express-validator
 */
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array().map(error => ({
        field: error.param,
        message: error.msg
      }))
    });
  }
  
  next();
};