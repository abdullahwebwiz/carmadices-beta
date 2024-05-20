const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "Name is required"],
    },
    email: { 
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"]
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isProvider: {
        type: Boolean,
        default: false,
    },
    shippingAddress: {
        type: String,
        required: [false, "Shipping address is optional"],
    },
    cash: {
        type: Number,
        default: 0, // Start with a default value of 0 indicating no money initially
        min: [0, "Cash amount cannot be negative"], // Ensure the cash value doesn't go negative
    },
    timeSlots: [{
        date: Date,
        dayOfWeek: String,
        startHour: Number,
        endHour: Number
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
