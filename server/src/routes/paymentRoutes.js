const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware'); // 1. Import upload middleware
const { submitProof } = require('../controllers/paymentController');

// 2. This is now your ONLY payment route
// @route   POST /api/payments/submit-proof
router.post(
  '/submit-proof',
  protect,
  upload.single('proof'), // 3. Use the middleware, 'proof' is the form field name
  submitProof
);

module.exports = router;