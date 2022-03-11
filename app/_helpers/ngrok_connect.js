const ngrok = require('ngrok');

let ngrokOptions = {
    proto: 'http',
    addr: process.env.HTTP_PORT,
};

if (process.env.NGROK_SUBDOMAIN) {
    ngrokOptions.subdomain = process.env.NGROK_SUBDOMAIN
}

const tunnelUp = () => {
    ngrok.connect(ngrokOptions)
        .then(url => {
            console.log(`--- ${url} is now mapped to localhost:${process.env.HTTP_PORT}`);
        })
        .catch(console.error);
}

const tunnelDown = () => {
    ngrok.disconnect();
}

const GetNGRok = () => {
    return ngrok;
}

module.exports = {
    tunnelUp,
    tunnelDown,
    GetNGRok
}