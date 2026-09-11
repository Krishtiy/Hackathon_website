const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');

// This import line is the most important
const { 
  register, 
  login, 
  getProfile, 
  getAllUsers, 
  deleteUser 
} = require('../controllers/authController');

// Register user
router.post('/register', register);

// Login user
router.post('/login', login);

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