const User = require('../models/user.model');

// Function to add time slots for every day except Monday
const addDefaultTimeSlots = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const days = ['Sunday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        days.forEach(day => {
            for (let i = 9; i < 18; i++) { // 9 AM to 5 PM
                const timeSlot = {
                    dayOfWeek: day,
                    startHour: i
                };
                user.timeSlots.push(timeSlot);
            }
        });
        await user.save();
        return user;
    } catch (error) {
        console.error('Error adding default time slots:', error);
        throw error;
    }
};

// Function to check if a user is available at a given time
const isUserAvailable = (user, dayOfWeek, hour) => {
    const timeSlot = user.timeSlots.find(slot => slot.dayOfWeek === dayOfWeek && slot.startHour === hour);
    return !!timeSlot;
};

module.exports = { addDefaultTimeSlots, isUserAvailable };
