const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const upload = require('../middlewares/uploadMiddleware'); // 1. Import upload middleware

const { 
  submitAnswer, 
  listSubmissionsForTeam,
  getSubmissionsForQuestion, 
  gradeSubmission,
  submitRound2, // 2. Import new functions
  getMyRound2Submission,
  getRound2Submissions
} = require('../controllers/submissionController');

// --- (Round 1 & Admin Routes - Unchanged) ---
router.post(
  '/',
  protect,
  [
    check('questionId').isMongoId().withMessage('questionId must be a valid id'),
    check('answer').notEmpty().withMessage('Answer is required')
  ],
  validateRequest,
  submitAnswer
);
router.get('/team', protect, listSubmissionsForTeam);
router.get(
  '/question/:questionId',
  protect,
  admin,
  getSubmissionsForQuestion
);
router.put(
  '/:id/grade',
  protect,
  admin,
  [ check('score').isInt({ min: 0 }).withMessage('Score must be a number') ],
  validateRequest,
  gradeSubmission
);

// --- 3. ADD THESE NEW ROUND 2 ROUTES ---

// @desc    Participant: Get team's Round 2 submission
// @route   GET /api/submissions/myteam/2
router.get('/myteam/2', protect, getMyRound2Submission);

// @desc    Team Leader: Submit for Round 2
// @route   POST /api/submissions/round2
router.post(
  '/round2',
  protect,
  upload.single('projectFile'), // 4. Use multer. 'projectFile' must match the form name
  submitRound2
);

router.get(
  '/round/2',
  protect,
  admin,
  getRound2Submissions
);

module.exports = router;