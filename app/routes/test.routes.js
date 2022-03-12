var router = require('express').Router();

module.exports = app => {

    router.get('/', (req, res) => {
        res.status(200).json({ message: "Welcome to dev-server-1. We are running!" });
    });

    app.use('/api/test', router);
}