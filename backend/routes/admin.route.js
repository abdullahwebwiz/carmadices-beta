const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authenticateToken");
const { dataAdmin, getOrdersWithUserInformation, getAdminDashboardData, getOrderCountsByProvider } = require('../controllers/admin.controller');
const requireAdmin = require('../middleware/requireAdmin');
const { clearTimeSlotsForUser, fetchAllUsers } = require('../controllers/user.controller'); // Import the clearTimeSlotsForUser function
const { approveOrder, undoApproveOrder } = require('../controllers/order.controller');

// Admin fetch data
router.get('/data', authenticateToken, requireAdmin, dataAdmin); // Pass dataAdmin as the route handler

// Admin fetch orders with user info
router.get('/orders', authenticateToken, requireAdmin, getOrdersWithUserInformation); // Pass getOrdersWithUserInformation as the route handler

// Admin fetch dashboard data
router.get('/dashboard-data', authenticateToken, requireAdmin, getAdminDashboardData);

// Route to clear timeSlots for a selected user as an admin
router.delete('/:userId/clear-time-slots', authenticateToken, requireAdmin, clearTimeSlotsForUser); // Use the imported function

router.get('/fetch-users', authenticateToken, requireAdmin, fetchAllUsers);

// Route to get order counts by provider ID
router.get('/order/count', authenticateToken, getOrderCountsByProvider);

// Routes to approve an order by ID and unco approve
router.put('/order/:orderId/approve', authenticateToken, requireAdmin, approveOrder);
router.put('/order/:orderId/undo-approve', authenticateToken, requireAdmin, undoApproveOrder);

module.exports = router;
