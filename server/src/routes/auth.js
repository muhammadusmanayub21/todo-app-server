const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

// Register route
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    validate,
  ],
  authController.register
);

// Login route
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
  ],
  authController.login
);

// Logout route
router.post('/logout', authController.logout);

// Get current user profile
router.get('/me', authenticate, authController.getMe);

module.exports = router;