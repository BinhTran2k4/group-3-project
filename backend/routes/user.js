// backend/routes/user.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 1. Import middleware mới và bỏ isAdmin
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole'); 
const upload = require('../middleware/upload');

// --- CÁC ROUTE CỦA USER CÁ NHÂN ---
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.post('/avatar', auth, upload.single('avatar'), userController.updateAvatar);

// --- CÁC ROUTE QUẢN LÝ (DÀNH CHO ADMIN & MODERATOR) ---

// 2. Cấp quyền cho cả admin và moderator để xem danh sách user
router.get('/', [auth, checkRole(['admin', 'moderator'])], userController.getUsers);

// 3. Cấp quyền cho cả admin và moderator để gọi API xóa
// Logic chi tiết "ai được xóa ai" sẽ nằm trong controller.
router.delete('/:id', [auth, checkRole(['admin', 'moderator'])], userController.deleteUser);

module.exports = router;