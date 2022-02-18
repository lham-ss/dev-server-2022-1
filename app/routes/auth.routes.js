module.exports = app => {
    const auth = require('../controllers/auth.controller');

    var router = require('express').Router();

    router.post("/", auth.login);                          // attempt login, set up jwt token
    router.post("/activate/:id", auth.activateAccount);    // set admin account to isActive = true

    app.use('/api/auth', router);
}
