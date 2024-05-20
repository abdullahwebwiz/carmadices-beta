const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authenticateToken");
const { dataAdmin, getOrdersWithUserInformation } = require('../controllers/provider.controller'); // Import the dataProvider and getOrdersWithUserInformation functions
const requireProvider = require('../middleware/requireProvider');

// Admin fetch data
router.get('/data', authenticateToken, requireProvider, dataAdmin); // Pass dataAdmin as the route handler

// Fetch orders assigned to providerId
router.get('/assigned', authenticateToken, requireProvider, getOrdersWithUserInformation);

module.exports = router;
