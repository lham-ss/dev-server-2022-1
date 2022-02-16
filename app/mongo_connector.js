require('dotenv').config();            // set up .env variables

const mongoose = require('mongoose');

let connection = null;

async function connectToAtlas() {
    return new Promise((resolve, reject) => {
        let mongoOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        mongoose.connect(process.env.MONGODB_URI, mongoOptions).catch((err) => reject(err));

        connection = mongoose.connection;

        connection.once('open', () => {
            console.log('MongoDB Atlas database connection established successfully!');
            resolve(true);
        });

        connection.on('error', (err) => {
            console.log("MongoDB Atlas connection error. (Did you add this IP to the Mongo Atlas WhiteList?)\n" + err);
            reject(err);
        });
    })
}

module.exports = {
    GetConnection: () => connection,

    connect: connectToAtlas,
};