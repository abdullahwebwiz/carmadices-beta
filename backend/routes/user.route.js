const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user.model.js"); // Import your User model
const Order = require('../models/order.model.js'); // Adjust the path as per your project structure

const jwt = require('jsonwebtoken');

const authenticateToken = require("../middleware/authenticateToken.js");
const { createUser, loginUser, verifyEmail, updateUser, logoutUser, fetchUser, fetchProviders, userExists, isProviderAvailable, clearTimeSlotsForUser, fetchProviderInfoForOrder, reassignProvider } = require("../controllers/user.controller.js");

const router = express.Router();

// Placeholder handler for the check-token validity route
router.get('/check-token', authenticateToken, (req, res) => {
    // Assuming authenticateToken middleware adds user info to req.user if the token is valid
    res.status(200).json({ message: "Token is valid", user: req.user });
});

// Signup
router.post('/signup', createUser);

// Signin
router.post('/signin', loginUser);

// Email Verification
router.get('/verify/:token', verifyEmail); // Corrected route path

// Route to fetch user profile
router.get('/profile', authenticateToken, fetchUser);

// Check if user with given email exist
router.get('/exists', userExists);

// Route to update user profile
router.put('/profile/update', authenticateToken, updateUser); // Added authenticateToken middleware

// Route to get all providers
router.get('/providers', fetchProviders);

// Route to check user availability for a given date
router.get('/availability', async (req, res) => {
    const { providerId, date } = req.query;

    console.log('Received parameters:');
    console.log('Provider ID:', providerId);
    console.log('Date:', date);

    if (!providerId || !date) {
        console.log('Missing one or more required parameters:');
        if (!providerId) console.log('Missing Provider ID');
        if (!date) console.log('Missing Date');
        return res.status(400).send('Missing required parameters');
    }

    try {
        const availability = await isProviderAvailable(providerId, new Date(date));
        res.json({ availability });
    } catch (error) {
        console.error('Error checking provider availability:', error);
        res.status(500).json({ message: error.message });
    }
});

// Route to fetch available providers for current order
router.get('/order/:orderId/fetch-providers', authenticateToken, fetchProviderInfoForOrder);

// Route to re-assign order to other provider
router.put('/order/:orderId/change-provider', authenticateToken, reassignProvider);

module.exports = router;

// Logout
router.post('/logout', logoutUser);

module.exports = router;
