const jwt = require('jsonwebtoken');

const verifyWebToken = async (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
            if (err) reject(err);
            else resolve(decoded)
        })
    });
};

module.exports = { verifyWebToken }
