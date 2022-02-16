require('dotenv').config();

const express = require("express");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 4000;

var corsOptions = {
    origin: "http://localhost:" + PORT
};

app.use(cors(corsOptions));                       // set up CORS policy
app.use(express.json());                          // parse requests of content-type - application/json
app.use(express.urlencoded({ extended: true }));  // parse requests of content-type - application/x-www-form-urlencoded


app.get("/", (req, res) => {
    res.json({ message: "Welcome to dev-server-1." });  // set up a test route
});


const mongo = require('./mongo_connector');

async function main() {
    await mongo.connect();

    if (!mongo.GetConnection()) {
        console.log('We do not have a mongo connetion... killing process.');
        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);      // listen for incoming http requests on PORT
    });
}

main();