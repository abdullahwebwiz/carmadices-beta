// middleware/authenticateToken.js
const verifyToken = require('../utils/verifyToken');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const decoded = await verifyToken(token);
        console.log('User authentication successful');
        req.user = { _id: decoded.userId, isAdmin: decoded.isAdmin, isProvider: decoded.isProvider };
        next();
    } catch (error) {
        return res.status(403).json({ error });
    }
};

module.exports = authenticateToken;