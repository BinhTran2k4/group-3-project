// routes/auth.js
const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');

// @route   POST api/auth/signup
// @desc    Đăng ký user
router.post('/signup', signup);

// @route   POST api/auth/login
// @desc    Đăng nhập user
router.post('/login', login);

module.exports = router;