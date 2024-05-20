const verifyToken = require('../utils/verifyToken');

const requireAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const decoded = await verifyToken(token);
        if (!decoded.isAdmin) {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }
        req.user = decoded; // Or just the parts you need
        next();
    } catch (error) {
        return res.status(403).json({ error });
    }
};

module.exports = requireAdmin;
