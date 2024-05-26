const User = require('../models/user.model');
exports.getProviders = async (req, res) => {
    try {
        const providers = await User.find({ isProvider: true }); // Assuming you want to fetch all users as customers
        res.json(providers);
    } catch (error) {
        console.log('bad thing happen to good people'+error);
        res.status(500).json({ message: "Internal server error" });
    }
};
