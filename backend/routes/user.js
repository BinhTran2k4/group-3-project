// backend/routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth'); // <-- Import middleware xác thực


router.get('/profile', auth, userController.getProfile);


router.put('/profile', auth, userController.updateProfile);


router.get('/', userController.getUsers); // Thay '/users' thành '/' vì tiền tố /api/users đã có ở server.js
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;