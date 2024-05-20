const Order = require('../models/order.model');
const User = require('../models/user.model');
const bcrypt = require("bcrypt");
const path = require('path');
const { upload } = require('../middleware/multer');
const mongoose = require('mongoose'); // Add this line to import mongoose

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { userId, address, orderType, totalPrice, status, serviceType, serviceProvider, scheduledDate, paymentStatus, isTint, tintColor, startHour, endHour, serviceLocation } = req.body;

        console.log('Received order data:', req.body);

        // Extract the date property from the scheduledDate object
        const { date, timeSlot: { startTime } } = scheduledDate;

        // Convert the date to a Date object
        const scheduledDateObject = new Date(date);

        // Combine date and start time to get the scheduled date and time
        scheduledDateObject.setHours(startTime);

        // Create a new order instance with adminCheck included
        const order = new Order({
            userId,
            orderType,
            items: [],
            totalPrice,
            status,
            serviceType,
            paymentStatus,
            shippingAddress: address,
            isTint,
            tintColor,
            adminCheck: false,
            timeSlot: {
                startHour,
                endHour,
                serviceProvider,
                scheduledDate: scheduledDateObject, // Assign the combined date and time
            },
            serviceLocation, // Include serviceLocation field
            beforeImagePath: "uploads/placeholder.png", // Set default before image path
            afterImagePath: "uploads/placeholder.png", // Set default after image path
        });

        // Save the order
        await order.save();

        res.status(201).json({ message: "Order created successfully", orderDetails: order });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
};


// Create new guest order (and create account)
exports.createGuestOrder = async (req, res) => {
    const { name, email, password, phone, shippingAddress, scheduledDate, startHour, endHour, status, paymentStatus, serviceLocation, serviceProvider, orderType, totalPrice, serviceType, isTint, tintColor } = req.body;

    console.log('Received order data:', req.body);

    // Extract the date property from the scheduledDate object
    const { date } = scheduledDate;
    const { startTime } = scheduledDate.timeSlot;

    // Convert the date to a Date object
    const scheduledDateObject = new Date(date);

    try {
        // Check if user already exists
        let user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            return res.status(400).json({ message: "User with this email already exists. Please log in." });
        }

        // Create new user for guest
        const hashedPassword = await bcrypt.hash(password, 12);
        user = new User({
            firstName: name,
            email: email.toLowerCase(),
            password: hashedPassword,
            phone,
        });

        await user.save();
        console.log('Guest user created:', user);

        // Combine date and start time to get the scheduled date and time
        scheduledDateObject.setHours(startTime);
        
        // Create order with newly created user's ID and address, including adminCheck
        const order = new Order({
            userId: user._id,
            orderType,
            totalPrice,
            status,
            serviceType,
            paymentStatus,
            shippingAddress,
            isTint,
            tintColor,
            adminCheck: false,
            timeSlot: {
                startHour: startTime,
                endHour, // Assuming endHour is already parsed
                serviceProvider,
                scheduledDate: scheduledDateObject, // Assign the combined date and time
            },
            serviceLocation,
            beforeImagePath: "uploads/placeholder.png", // Set default before image path
            afterImagePath: "uploads/placeholder.png", // Set default after image path
        });

        // Save the order
        await order.save();
        console.log('Order created:', order);

        // Update the user document with the shipping address
        await User.findByIdAndUpdate(user._id, { shippingAddress });

        // Update the provider's timeSlots array with the scheduled time slot
        const provider = await User.findById(serviceProvider);
        if (!provider) {
            return res.status(404).json({ error: 'Provider not found' });
        }

        // Push the scheduled time slot to the provider's timeSlots array
        const slot = {
            date: scheduledDateObject.toISOString(), // Convert date to ISO string
            dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][scheduledDateObject.getDay()],
            startHour: startTime,
            endHour,
        };

        provider.timeSlots.push(slot);
        await provider.save();
        console.log('Provider time slots updated:', provider.timeSlots);

        res.status(201).json({ message: "Order and account created successfully", orderDetails: order });
    } catch (error) {
        console.error('Error processing guest order:', error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Sample backend code to retrieve and send orders with items
exports.getAllOrdersForUser = async (req, res) => {
    try {
        const userId = req.user._id; // Retrieve user ID from authenticated user
        const orders = await Order.find({ userId }).populate('userId');

        // If items are stored as an array of objects, ensure they are properly populated
        const ordersWithItems = orders.map(order => ({
            ...order.toObject(), // Convert Mongoose document to plain JavaScript object
            items: order.items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            }))
        }));

        res.json(ordersWithItems);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get order by ID for the authenticated user
exports.getOrderByIdForUser = async (req, res) => {
    const orderId = req.params.orderId; // Assuming the order ID is passed in the URL params
    try {
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            // Return an error response if the ID is not valid
            return res.status(400).json({ error: 'Invalid order ID' });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            // Return a 404 response if order not found
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update order status by ID
exports.updateOrderStatus = async (req, res) => {
    try {
        console.log('Received request body:', req.body);
        console.log('Order ID from params:', req.params.id);
        
        const { status } = req.body;
        console.log('Status to update:', status);
        
        // Find the order by ID
        const order = await Order.findById(req.params.id);
        if (!order) {
            console.log('Order not found');
            return res.status(404).json({ error: 'Order not found' });
        }
        
        // Check if the authenticated user is the service provider for this order
        const serviceProviderId = order.timeSlot.serviceProvider.toString(); // Convert ObjectId to string for comparison
        console.log('Authenticated user:', req.user);
        console.log('Service provider ID:', serviceProviderId);
        if (serviceProviderId !== req.user._id) {
            console.log('Unauthorized access');
            return res.status(403).json({ error: 'Unauthorized access' });
        }

        // Update order status
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        console.log('Updated order:', updatedOrder);

        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateOrderWithImages = async (req, res) => {
    console.log('Received request params:', req.params);
    console.log('Received files:', req.files);

    if (!req.files || (req.files.beforeImages.length === 0 && req.files.afterImages.length === 0)) {
        console.log('No files uploaded:', req.files);
        return res.status(400).json({ error: 'No files were uploaded.' });
    }

    const { orderId } = req.params;
    const beforeImages = req.files.beforeImages ? req.files.beforeImages.map(file => file.path) : [];
    const afterImages = req.files.afterImages ? req.files.afterImages.map(file => file.path) : [];

    console.log(`Processing order ${orderId} with before images:`, beforeImages);
    console.log(`Processing order ${orderId} with after images:`, afterImages);

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            console.log(`Order not found: ${orderId}`);
            return res.status(404).json({ message: "Order not found" });
        }

        // Append new image paths to existing ones
        const updatedBeforeImages = order.beforeImages.concat(beforeImages);
        const updatedAfterImages = order.afterImages.concat(afterImages);

        order.beforeImages = updatedBeforeImages;
        order.afterImages = updatedAfterImages;

        // Save the updated order
        await order.save();

        console.log('Order updated successfully:', order);
        res.json({
            message: "Order updated with images successfully",
            order,
        });
    } catch (error) {
        console.error('Error updating order with images:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
};




// Function to clean arrays for afterImages and beforeImages in an order
exports.cleanOrderImages = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Find the order by ID
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Clear the arrays for afterImages and beforeImages
        order.afterImages = [];
        order.beforeImages = [];

        // Save the updated order
        await order.save();

        res.json({ message: "Order images cleaned successfully", order });
    } catch (error) {
        console.error('Error cleaning order images:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
};

// Update order adminCheck to true and add cash to user's account
exports.approveOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Find the order by ID and update adminCheck to true
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Calculate commission (70% of total price)
        const commission = order.totalPrice * 0.70;

        // Update user's account (service provider) by adding the commission
        const updatedUser = await User.findByIdAndUpdate(order.timeSlot.serviceProvider, {
            $inc: { cash: commission }
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update order's adminCheck
        order.adminCheck = true;
        await order.save();

        res.json({
            message: "Order approved successfully",
            updatedOrder: order,
            updatedUser: updatedUser,
        });
    } catch (error) {
        console.error('Error updating order adminCheck:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
};

// Undo approval of an order and delete cash from user's account
exports.undoApproveOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Find the order by ID
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Calculate commission (70% of total price)
        const commission = order.totalPrice * 0.70;

        // Update user's account (service provider) by subtracting the commission
        const updatedUser = await User.findByIdAndUpdate(order.timeSlot.serviceProvider, {
            $inc: { cash: -commission }
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update order's adminCheck
        order.adminCheck = false;
        await order.save();

        res.json({
            message: "Order approval undone successfully",
            updatedOrder: order,
            updatedUser: updatedUser,
        });
    } catch (error) {
        console.error('Error undoing order approval:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
};

// Delete order by ID
exports.deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};