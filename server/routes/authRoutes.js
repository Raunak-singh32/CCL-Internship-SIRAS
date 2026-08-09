const express = require('express');
const router = express.Router();

const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// ==========================================
// AUTH ROUTES
// ==========================================

// Register new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Get current logged-in user (protected)
router.get('/me', protect, getMe);

module.exports = router;