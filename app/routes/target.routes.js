const targets = require('../controllers/target.controller');
const auth = require('../middleware/authJwt');
const express = require('express');

var router = express.Router();

module.exports = app => {

    router.post("/", targets.create);             // create a new sms/email target document
    router.get("/:id", targets.findOne);          // find target by id
    router.get("/", targets.findAll);                // list all user

    app.use('/api/targets',
        /* [auth.verifyToken], */
        router
    );
};