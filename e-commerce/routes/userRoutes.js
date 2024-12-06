const express = require('express');
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.get("/", userController.getListUsers)

// Public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protected routes (ensure these functions exist in the controller)
router.get('/:userId', authMiddleware, userController.getUserProfile);
router.put('/profile', authMiddleware, userController.editProfile);
router.delete('/profile', authMiddleware, userController.deleteProfile);

module.exports = router;
