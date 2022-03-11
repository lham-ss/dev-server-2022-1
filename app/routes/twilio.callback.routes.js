const twilioCallbacks = require("../controllers/twilio.callbacks.controller");

var router = require('express').Router();

module.exports = app => {

    router.post("/messageStatus",
        twilioCallbacks.smsStatusHook,
    );

    router.post('/post-chat-hook',
        twilioCallbacks.conversationPostHook,
    );

    router.post('/pre-chat-hook',
        twilioCallbacks.conversationPreHook,
    )


    app.use('/api/v1', router);
}
