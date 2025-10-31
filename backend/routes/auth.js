const express = require('express');
const router = express.Router();

const { 
    signup, 
    login, 
    refreshToken, // MỚI
    logout,       // MỚI
    forgotPassword, 
    resetPassword 
} = require('../controllers/authController');


// @route   POST api/auth/signup
// @desc    Đăng ký user mới
router.post('/signup', signup);

// @route   POST api/auth/login
// @desc    Đăng nhập và nhận về cả access token và refresh token
router.post('/login', login);

// @route   POST api/auth/refresh
// @desc    Làm mới access token bằng refresh token (Endpoint mới cho Hoạt động 1)
router.post('/refresh', refreshToken);

// @route   POST api/auth/logout
// @desc    Đăng xuất user (xóa refresh token khỏi DB) (Endpoint mới cho Hoạt động 1)
router.post('/logout', logout);

// @route   POST api/auth/forgot-password
// @desc    Yêu cầu link đặt lại mật khẩu
router.post('/forgot-password', forgotPassword);

// @route   PUT api/auth/reset-password/:token
// @desc    Đặt lại mật khẩu bằng token nhận được qua email
router.put('/reset-password/:token', resetPassword);

module.exports = router;
