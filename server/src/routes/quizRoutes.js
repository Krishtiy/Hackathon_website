const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { startQuiz, submitQuiz, getMySubmission } = require('../controllers/quizController');
const { submissionEvents } = require('../queues/submissionQueue');
const LeaderboardService = require('../services/leaderboardService');
const idempotency = require('../middlewares/idempotency');
const slidingWindowLimiter = require('../middlewares/rateLimiter');

const quizLimiter = slidingWindowLimiter({ limit: 10, windowSec: 60, keyPrefix: 'quiz' });

// @desc    Participant: Start the quiz
// @route   GET /api/quiz/start/1
router.get('/start/1', protect, startQuiz);

// @desc    Participant: Submit the quiz (protected against double submissions)
// @route   POST /api/quiz/submit/1
router.post('/submit/1', protect, quizLimiter, idempotency(120), submitQuiz);

// @desc    Participant: Get their submission for Round 1
// @route   GET /api/quiz/my-submission/1
router.get('/my-submission/1', protect, getMySubmission);

// @desc    Real-time Leaderboard via Redis Sorted Sets
// @route   GET /api/quiz/leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const topTeams = await LeaderboardService.getTop(limit);
    res.json(topTeams);
  } catch (err) {
    res.status(500).json({ message: 'Leaderboard error', error: err.message });
  }
});

// @desc    SSE stream for submission evaluation progress
// @route   GET /api/quiz/submissions/:id/stream
router.get('/submissions/:id/stream', (req, res) => {
  const submissionId = req.params.id;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const onUpdate = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
    if (data.status === 'COMPLETED' || data.status === 'FAILED') {
      cleanup();
    }
  };

  const cleanup = () => {
    submissionEvents.removeListener(`status:${submissionId}`, onUpdate);
    res.end();
  };

  submissionEvents.on(`status:${submissionId}`, onUpdate);
  req.on('close', cleanup);
});

module.exports = router;