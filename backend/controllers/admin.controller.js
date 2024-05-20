const Order = require('../models/order.model');
const User = require('../models/user.model');
const mongoose = require('mongoose'); // Add this line to import mongoose

// Fetch data for Admin
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
    try {
        // Fetch orders from the database
        const orders = await Order.find().lean();

        // Fetch user information for each order
        for (const order of orders) {
            const user = await User.findById(order.userId).lean();

            // Check if user exists before accessing its properties
            if (user) {
                // Include user information (name and email) in the order object
                order.customerName = user.firstName;
                order.customerEmail = user.email;
                order.customerPhone = user.phone; // Add phone to the order object
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

// Fetch admin dashboard data with date range
exports.getAdminDashboardData = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Parse the provided dates or use default date range (current month)
        const parsedStartDate = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const parsedEndDate = endDate ? new Date(endDate) : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        // Aggregate pipeline to calculate order statistics within the date range
        const stats = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: parsedStartDate, $lte: parsedEndDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$totalPrice" },
                    pendingOrders: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "Pending"] }, 1, 0]
                        }
                    },
                    completedOrders: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "Completed"] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        // If the aggregation returns an empty array, initialize stats manually
        const result = stats.length ? stats[0] : {
            totalOrders: 0,
            totalRevenue: 0,
            pendingOrders: 0,
            completedOrders: 0
        };

        res.json({
            success: true,
            data: {
                totalOrders: result.totalOrders,
                totalRevenue: result.totalRevenue.toFixed(2), // Format revenue to 2 decimal places
                pendingOrders: result.pendingOrders,
                completedOrders: result.completedOrders
            }
        });
    } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getOrderCountsByProvider = async (req, res) => {
    try {
        const { providerId } = req.query;

        // Check if providerId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(providerId)) {
            return res.status(400).json({ error: 'Invalid providerId' });
        }

        // Adjusting query to handle the nested serviceProvider within timeSlot
        const orderCountsCompleted = await Order.countDocuments({
            'timeSlot.serviceProvider': providerId,
            status: 'Completed'
        });
        const orderCountsPending = await Order.countDocuments({
            'timeSlot.serviceProvider': providerId,
            status: 'Pending'
        });

        res.json({ providerId, orderCounts: { completed: orderCountsCompleted, pending: orderCountsPending } });
    } catch (error) {
        console.error('Error fetching order counts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
