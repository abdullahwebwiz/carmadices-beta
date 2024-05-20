const Order = require('../models/order.model');
const User = require('../models/user.model');

// Fetch data for Provider
exports.dataAdmin = async (req, res) => {
    try {
        const orders = await Order.find(); // Assuming you have a find method on Order
        const customers = await User.find(); // Assuming you want to fetch all users as customers
        res.json({ orders, customers });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// Fetch orders with user information
exports.getOrdersWithUserInformation = async (req, res) => {
    console.log('Fetching orders for providerId:', req.user.userId);
    try {
        // Check if user ID is available
        if (!req.user || !req.user.userId) {
            return res.status(400).json({ message: 'User ID missing, cannot fetch orders.' });
        }

        // Fetch orders from the database where 'serviceProvider' matches 'userId' from the token
        const orders = await Order.find({ 'timeSlot.serviceProvider': req.user.userId }).lean();
        console.log('Orders found:', orders.length);

        // Fetch user information for each order
        for (const order of orders) {
            const user = await User.findById(order.userId).lean();

            // Check if user exists before accessing its properties
            if (user) {
                // Include user information (name, email, and phone) in the order object
                order.customerName = user.firstName || 'Unknown';
                order.customerEmail = user.email || 'Unknown';
                order.customerPhone = user.phone || 'Unknown';
            } else {
                // Handle the case where user is not found
                order.customerName = 'Unknown';
                order.customerEmail = 'Unknown';
                order.customerPhone = 'Unknown';
            }
        }

        // Send the modified orders data with user information in the response
        res.json({ orders });
    } catch (error) {
        console.error('Error fetching orders with user information:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



