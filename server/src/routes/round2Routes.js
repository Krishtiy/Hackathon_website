const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { uploadRound2Zip } = require('../controllers/round2Controller');

// POST /api/round2/upload
router.post('/upload', protect, upload.single('zip'), uploadRound2Zip);

module.exports = router;
