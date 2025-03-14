const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const config = require('../config');

const prisma = new PrismaClient();

/**
 * Middleware to authenticate requests using JWT
 */
exports.authenticate = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({ error: 'Not authorized, no token provided' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwtSecret);

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, name: true },
      });

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};