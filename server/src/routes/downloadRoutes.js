const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { downloadFile } = require('../controllers/downloadController');

// @desc    Download a file from the uploads folder
// @route   GET /api/download?filepath=...
router.get('/', protect, downloadFile);

module.exports = router;