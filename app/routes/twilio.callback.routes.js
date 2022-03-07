const twilioCallbacks = require("../controllers/twilio.callbacks.controller");

var router = require('express').Router();

module.exports = app => {

    router.post("/messageStatus",
        twilioCallbacks.messageStatus,
    );

    app.use('/api/v1', router);
}
