// backend/routes/user.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole'); 
const upload = require('../middleware/upload');

// ... (các route profile, avatar) ...
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.post('/avatar', auth, upload.single('avatar'), userController.updateAvatar);


// --- CÁC ROUTE QUẢN LÝ ---
router.get('/', [auth, checkRole(['admin', 'moderator'])], userController.getUsers);
router.delete('/:id', [auth, checkRole(['admin', 'moderator'])], userController.deleteUser);


router.get('/logs', [auth, checkRole(['admin'])], userController.getLogs);

module.exports = router;