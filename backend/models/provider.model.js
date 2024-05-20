const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'  // Assuming the provider details are linked to the User collection
    },
    assignedOrders: [{
        orderId: mongoose.Schema.Types.ObjectId,
        orderDate: Date,
        status: String
    }],
    availabilitySlots: [{
        day: String,
        startTime: String,
        endTime: String
    }]
});

module.exports = mongoose.model('Provider', providerSchema);
