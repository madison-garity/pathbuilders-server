const express = require('express');
const { login, forgotPassword, resetPassword } = require('../controllers/authController'); // Import the controller function
const router = express.Router();

// POST /login route for user login
router.post('/login', login); // Link to the login controller function

// Route for forgot password
router.post('/forgot-password', forgotPassword);

// Route for reset password with token
router.post('/reset-password/:token', resetPassword);

module.exports = router;
