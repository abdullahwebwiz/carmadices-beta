const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const ordersController = require('../controllers/order.controller');
const jwt = require('jsonwebtoken');
const { upload, storage } = require('../middleware/multer');

// Route to get all orders for the authenticated user
router.get('/', authenticateToken, ordersController.getAllOrdersForUser);

// Route to get a specific order by ID for the authenticated user
router.get('/:id', authenticateToken, ordersController.getOrderByIdForUser);

// Route to create a new order for the authenticated user
router.post('/', authenticateToken, ordersController.createOrder);

// New endpoint for guest orders with registration
router.post('/guest-order', ordersController.createGuestOrder);
router.post('/guest-order-two', ordersController.createGuestOrderTwo);

// Route to update the status of an order by ID for the authenticated user
router.put('/:id/status', authenticateToken, ordersController.updateOrderStatus);

// Route to delete an order by ID for the authenticated user
router.delete('/:id', authenticateToken, ordersController.deleteOrder);

// Route to upload images for an order
router.post('/:orderId/images', authenticateToken, upload, ordersController.updateOrderWithImages);

router.post('/:orderId/cleanImages', authenticateToken, ordersController.cleanOrderImages);

// Route to update order with image paths
router.put('/:orderId/images', authenticateToken, ordersController.updateOrderWithImages);

module.exports = router;
