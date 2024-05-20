// utils/verifyToken.js
const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                reject('Token is invalid or expired');
            } else {
                resolve(decoded);
            }
        });
    });
};

module.exports = verifyToken;
