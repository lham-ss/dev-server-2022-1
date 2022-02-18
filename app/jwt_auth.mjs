import jwt from 'jsonwebtoken';

export async function verifyWebToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
            if (err) reject(err);
            else resolve(decoded)
        })
    });
};

