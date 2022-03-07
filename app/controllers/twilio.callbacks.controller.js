

exports.messageStatus = (req, res) => {
    const { MessageSid, MessageStatus } = req.body;

    console.log(`SID: ${MessageSid}, Status: ${MessageStatus}`);

    res.sendStatus(200);
}