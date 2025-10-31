const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 1. Import đầy đủ các middleware cần thiết
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const upload = require('../middleware/upload');

// ==========================================================
// --- CÁC ROUTE DÀNH CHO USER ĐÃ ĐĂNG NHẬP (Bất kể vai trò) ---
// ==========================================================

// Lấy thông tin profile của chính mình
router.get('/profile', auth, userController.getProfile);

// Cập nhật thông tin profile của chính mình
router.put('/profile', auth, userController.updateProfile);

// Cập nhật avatar của chính mình
// Lưu ý: Route này nên là POST /users/avatar để nhất quán với frontend
router.post('/avatar', auth, upload.single('avatar'), userController.updateAvatar);


// ==========================================================
// --- CÁC ROUTE CHỈ DÀNH CHO ADMIN ---
// ==========================================================

// Express sẽ chạy middleware theo thứ tự: `auth` trước, `isAdmin` sau.
// @route   GET /api/users
// @access  Private (Admin)
router.get('/', [auth, isAdmin], userController.getUsers);

// @route   DELETE /api/users/:id
// @access  Private (Admin)
router.delete('/:id', [auth, isAdmin], userController.deleteUser);

module.exports = router;








