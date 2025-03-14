const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Generate a JWT token for a user
 * @param {string} userId - The user's ID
 * @returns {string} JWT token
 */
exports.generateToken = (userId) => {
  return jwt.sign({ userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};