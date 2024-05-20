const mongoose = require('mongoose');

// Define an item schema for the array of items in an order
const itemSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    price: Number,
    itemType: {
        type: String,
        enum: ['Product', 'Service'], // Distinguishes between products and services
        required: true
    },
    // Optionally, add a flag to identify cross-sell items
    isCrossSell: {
        type: Boolean,
        default: false
    }
}, { _id: false }); // Prevent Mongoose from creating an _id for sub-documents if not needed

const orderSchema = new mongoose.Schema({
    orderType: {
        type: String,
        enum: ['Product', 'Service'],
        required: true
    },
    items: [itemSchema], // Use the updated item schema here
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Shipped', 'Completed'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // Change shippingAddress to a simple string
    shippingAddress: {
        type: String,
        required: function() { return this.orderType === 'Product' || this.items.some(item => item.itemType === 'Product'); }
    },
    serviceType: {
        type: String,
        required: function() { return this.orderType === 'Service'; }
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isTint: Boolean,
    tintColor: String,
    beforeImages: [String],  // Changed to an array of strings
    afterImages: [String],   // Changed to an array of strings
    adminCheck: {
        type: Boolean,
        default: false
    },
    serviceLocation: {
        type: String,
        enum: ['Garage', 'CustomerLocation'],
        required: true,
        validate: {
            validator: function(value) {
                return ['garage', 'customerlocation'].includes(value.toLowerCase());
            },
            message: props => `${props.value} is not a valid service location.`
        }
    },
    timeSlot: {
        startHour: Number,
        endHour: Number,
        serviceProvider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',  // Referencing the User model
            validate: {
                validator: async function(value) {
                    // Check if the referenced user is a provider
                    const provider = await mongoose.model('User').findById(value);
                    return provider && provider.isProvider;  // Ensure the user is marked as a provider
                },
                message: props => `The specified user ${props.value} is not a provider!`
            },
            required: function() { return this.orderType === 'Service'; }
        },
        scheduledDate: {
            type: Date,
            required: function() { return this.orderType === 'Service'; }
        },
    }
    // Consider adding more fields here for analytics or operational metrics related to cross-selling
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
