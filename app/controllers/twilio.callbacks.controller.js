const twilio = require('twilio');

const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.smsStatusHook = (req, res) => {
    const { MessageSid, MessageStatus } = req.body;

    console.log(`SID: ${MessageSid}, Status: ${MessageStatus}`);

    res.sendStatus(200);
}

exports.conversationPostHook = (req, res) => {
    console.log("Received a post-event webhook:");
    console.log(JSON.stringify(req.body, null, 2));

    /*
    if (req.body.EventType === 'onConversationAdded') {
        const me = "Tackleton";
        client.conversations.v1.conversations(req.body.ConversationSid)
            .participants
            .create({
                identity: me
            })
            .then(participant => console.log(`Added ${participant.identity} to ${req.body.ConversationSid}.`))
            .catch(err => console.error(`Failed to add a member to ${req.body.ConversationSid}!`, err));
    }
    */

    console.log("(200 OK!)");

    try {
        res.app.webSockets.emit('post-chat-webhook', req.body);
    }
    catch (e) { console.trace(e) }

    res.sendStatus(200);
}

exports.conversationPreHook = (req, res) => {
    console.log("Received a pre-event webhook:", req.body);
    console.log(JSON.stringify(req.body, null, 2));

    /*
    if (req.body.EventType === 'onConversationAdd') {
        const me = "Tackleton";
        client.conversations.v1.conversations(req.body.ConversationSid)
            .participants
            .create({
                identity: me
            })
            .then(participant => console.log(`Added ${participant.identity} to ${req.body.ConversationSid}.`))
            .catch(err => console.error(`Failed to add a member to ${req.body.ConversationSid}!`, err));
    }
    */

    console.log("(200 OK!)");

    try {
        res.app.webSockets.emit('pre-chat-webhook', req.body);
    }
    catch (e) { console.trace(e) }

    res.sendStatus(200);
}