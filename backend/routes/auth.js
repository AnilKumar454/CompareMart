const express = require('express');
const router = express.Router();
const {
  register,
  login,
  googleAuth,
  getMe,
  completeProfile,
  checkEmail,
  updatePreferences
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/check-email', checkEmail);

// Protected routes
router.get('/me', protect, getMe);
router.put('/complete-profile', protect, completeProfile);
router.put('/preferences', protect, updatePreferences);

module.exports = router;
