const express = require('express');
const router = express.Router();
const kycController = require('../controller/kycController');

// Route to check if the server is running (Optional Health Check)
router.get('/checkAuthStatus', (req, res) => {
  res.status(200).json({ message: 'KYC Service is running' });
});

// Route to generate OTP
router.post('/generateOTP', kycController.generateOTP);

// Route to verify OTP
router.post('/verifyOTP', kycController.verifyOTP);

module.exports = router;
