require('dotenv').config();

const express = require("express");
const mongo = require('./_helpers/mongo_connect');
const cors = require("cors");
const app = express();

const PORT = process.env.HTTP_PORT || 4000;

var corsOptions = {
    origin: "http://localhost:4000",
};

app.use(cors(/*corsOptions*/));                     // set up CORS policy
app.use(express.json());                            // parse requests of content-type - application/json
app.use(express.urlencoded({ extended: true }));    // parse requests of content-type - application/x-www-form-urlencoded

app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to dev-server-1. We are running." });  // set up a test route
});

require('./routes/user.routes')(app);
require('./routes/auth.routes')(app);
require('./routes/twilio.callback.routes')(app);

async function main() {
    await mongo.connectToDatabase()
        .catch(err => {
            console.log('--- Error connecting to MongoDB ---');
            console.trace(err);
            console.log('--- Killing process...');

            process.exit();
        });

    if (!mongo.GetConnection()) {
        console.log('--- No exception thrown but mongo connetion still undefined ---');
        console.log('--- Killing process...');

        process.exit();
    }

    app.listen(PORT, () => {
        console.log(`--- Server is running on port ${PORT}.`);      // listen for incoming http requests on PORT
    });
}

main();