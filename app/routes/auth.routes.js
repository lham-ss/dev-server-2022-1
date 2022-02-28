const auth = require('../controllers/auth.controller');

const mw = require('../middleware/verifyUserCreation');
const jwt = require('../middleware/authJwt');

var router = require('express').Router();

module.exports = app => {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );

        next();
    });

    router.post(
        "/",
        auth.login
    );

    router.post(
        "/activate/:id",
        jwt.verifyToken,
        auth.activateAccount
    );

    router.post(
        "/create",
        [
            jwt.verifyToken,
            mw.checkDuplicateUsernameOrEmail,
            mw.checkRolesExisted
        ],
        auth.createUser
    );

    app.use('/api/auth', router);
}
