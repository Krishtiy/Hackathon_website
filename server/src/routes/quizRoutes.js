const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { startQuiz, submitQuiz, getMySubmission } = require('../controllers/quizController');

// @desc    Participant: Start the quiz
// @route   GET /api/quiz/start/1
router.get('/start/1', protect, startQuiz);

// @desc    Participant: Submit the quiz
// @route   POST /api/quiz/submit/1
router.post('/submit/1', protect, submitQuiz);

// @desc    Participant: Get their submission for Round 1
// @route   GET /api/quiz/my-submission/1
router.get('/my-submission/1', protect, getMySubmission);

module.exports = router;