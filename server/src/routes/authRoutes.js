const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const slidingWindowLimiter = require('../middlewares/rateLimiter');
const idempotency = require('../middlewares/idempotency');

// Rate limit auth requests (5 attempts per minute per IP)
const authLimiter = slidingWindowLimiter({ limit: 5, windowSec: 60, keyPrefix: 'auth' });

// This import line is the most important
const {
  register,
  login,
  getProfile,
  getAllUsers,
  deleteUser
} = require('../controllers/authController');

// Register user (rate limited + idempotency protected)
router.post('/register', authLimiter, idempotency(60), register);

// Login user (rate limited against brute force)
router.post('/login', authLimiter, login);

// Get user profile
router.get('/profile', protect, getProfile);

// Admin: Get all users
router.get(
  '/users',
  protect,
  admin,
  getAllUsers
);

// Admin: Delete a user
router.delete(
  '/users/:id',
  protect,
  admin,
  deleteUser
);

module.exports = router;