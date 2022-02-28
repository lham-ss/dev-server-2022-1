const { verifyWebToken } = require('../old.jwt_auth');

// import { verifyWebTokenMJS } from '../jwt_auth.mjs';

const isUserAuthenticated = (req, res, next) => {
    if (!req.headers['auth-token']) {
        return res.status(403).json({
            status: 403,
            message: 'FORBIDDEN'
        })
    } else {
        const token = req.headers['auth-token'];

        if (token) {
            return verifyWebToken(token)
                .then((user) => {
                    req.type = user.type;
                    req.phonenNumber = user.phoneNumber;
                    req.id = user.id;
                    req.email = user.email;
                    next()
                })
                .catch((err) => {
                    console.error('--- JsonWebTokenError: invalid token... refusing authentication.')

                    return res.status(401).json({
                        auth: false,
                        status: 401,
                        message: 'UNAUTHORIZED'
                    });
                })
        } else {
            return res.status(403).json({
                auth: false,
                status: 403,
                message: 'FORBIDDEN'
            })
        }
    }
}

module.exports = { isUserAuthenticated };