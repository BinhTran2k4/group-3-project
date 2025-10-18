// backend/routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');


router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);

router.get('/', [auth, isAdmin], userController.getUsers);


router.delete('/:id', [auth, isAdmin], userController.deleteUser);


module.exports = router;