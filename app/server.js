require('dotenv').config();

const express = require("express");
const cors = require("cors");

const mongo = require('./_helpers/mongo_connect');
const websocket = require('./_helpers/websocket');
const ngroc = require('./_helpers/ngrok_connect');

const app = express();

const PORT = process.env.HTTP_PORT || 4000;

var corsOptions = {
    origin: "*",
};

app.use(cors(corsOptions));                         // set up CORS policy
app.use(express.json());                            // parse requests of content-type - application/json
app.use(express.urlencoded({ extended: true }));    // parse requests of content-type - application/x-www-form-urlencoded

require('./routes/test.routes')(app);
require('./routes/user.routes')(app);
require('./routes/auth.routes')(app);
require('./routes/twilio.callback.routes')(app);

async function main() {
    await mongo.connectToDatabase()
        .catch(err => {
            console.log('--- Error connecting to MongoDB');
            console.trace(err);
            process.exit();
        });

    if (!mongo.GetConnection()) {
        console.log('--- No exception thrown but mongo connetion still undefined.');
        process.exit();
    }

    let server = require('http').Server(app);

    server.listen(PORT, () => {                                      // listen for incoming http requests on PORT
        console.log(`--- Server is running on port ${PORT}.`);
        websocket.initWebSocket(server);                             // connect our websocket
        ngroc.tunnelUp();                                            // connect to ngrok.io tunnel service
    });
}

main();

