const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const { getHackathonState, updateRound1State, updateRound2State, uploadCertificate } = require('../controllers/stateController');
const upload = require('../middlewares/uploadMiddleware');

// @desc    Get the current hackathon state (for everyone)
// @route   GET /api/state
router.get('/', protect, getHackathonState);

// @desc    Admin: Update Round 1 status
// @route   POST /api/state/round1
router.post('/round1', protect, admin, updateRound1State);

// @desc    Admin: Update Round 2 status
// @route   POST /api/state/round2
router.post('/round2', protect, admin, updateRound2State);

// @desc    Admin: Upload a certificate template
// @route   POST /api/state/certificate/:round
router.post(
  '/certificate/:round',
  protect,
  admin,
  upload.single('certificate'), // 'certificate' is the form field name
  uploadCertificate
);

module.exports = router;