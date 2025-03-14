const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { generateToken } = require('../utils/jwt');

const prisma = new PrismaClient();

/**
 * Register a new user
 * @route POST /api/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Generate JWT token
    const token = generateToken(user.id);

// When setting the cookie in login/register endpoints
res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // false in development
  sameSite: 'lax',  // Change from 'strict' to 'lax'
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

    // Return user info (excluding password)
    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login a user
 * @route POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user.id);

// When setting the cookie in login/register endpoints
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // false in development
      sameSite: 'lax',  // Change from 'strict' to 'lax'
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    // Return user info (excluding password)
    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout a user
 * @route POST /api/auth/logout
 */
exports.logout = async (req, res, next) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict'
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/me
 */
exports.getMe = async (req, res, next) => {
  try {
    // User is already attached to req by auth middleware
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};