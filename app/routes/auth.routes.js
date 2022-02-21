module.exports = app => {
    const auth = require('../controllers/auth.controller');
    const mw = require('../middleware/auth.middleware');

    var router = require('express').Router();

    router.post("/", auth.login); // attempt login, set up jwt token

    router.post("/activate/:id", mw.isUserAuthenticated, auth.activateAccount); // set admin account to isActive = req.body.status

    app.use('/api/auth', router);
}
