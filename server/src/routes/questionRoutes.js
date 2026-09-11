const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');

// This import now matches the controller's exports
const { 
  createQuestion, 
  listQuestions, 
  deleteQuestion, 
  updateQuestion 
} = require('../controllers/questionController');

// @desc    Admin: Create question
// @route   POST /api/questions
router.post(
  '/',
  protect,
  admin,
  [
    check('round').isInt({ min: 1, max: 2 }).withMessage('Round must be 1 or 2'),
    check('title').notEmpty().withMessage('Title is required'),
  ],
  validateRequest,
  createQuestion
);

// @desc    Participant: List questions by round
// @route   GET /api/questions
router.get('/', protect, listQuestions);

// @desc    Admin: Update a question
// @route   PUT /api/questions/:id
router.put(
  '/:id',
  protect,
  admin,
  updateQuestion
);

// @desc    Admin: Delete a question
// @route   DELETE /api/questions/:id
router.delete(
  '/:id',
  protect,
  admin,
  deleteQuestion
);

module.exports = router;