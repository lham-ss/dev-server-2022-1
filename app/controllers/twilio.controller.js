const twilio = require('twilio');

const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const AccessToken = twilio.jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;

exports.createChatToken = async (req, res) => {
    const identity = req.body.identity;

    if (!identity) return res.json({ token: null, error: true, message: 'Identity required.' })

    const chatGrant = new ChatGrant({
        serviceSid: process.env.TWILIO_CHAT_SERVICE_SID,
    });

    const token = new AccessToken(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_API_KEY,
        process.env.TWILIO_API_SECRET,
        { identity: identity }
    );

    token.addGrant(chatGrant);

    res.json({ token: token.toJwt() })
}