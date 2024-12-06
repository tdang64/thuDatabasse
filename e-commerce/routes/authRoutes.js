const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Correct path to authController.js

// Admin Registration Route
router.post('/register', authController.registerAdmin); // Ensure this method is defined in authController
// Admin Login Route
router.post('/login', authController.loginAdmin); // Ensure this method is defined in authController
// Admin get all users
router.get('/', authController.getUsersProfile); // Ensure this method is defined in authController 
// Admin get users profile by id
router.get('/:id', authController.getUserProfileById); // Ensure this method is defined in authController
// Admin edit users profile by id
router.put('/:id', authController.updateUserProfile); // Ensure this method is defined in authController
// Admin delete users profile by id
router.delete('/:id', authController.deleteUserProfile); // Ensure this method is defined in authController

router.post("/signin", authController.loginUser)

module.exports = router;
