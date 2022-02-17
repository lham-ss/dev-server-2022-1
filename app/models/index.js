const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const db = {
    mongoose: mongoose,
    url: process.env.MONGODB_URI,
    admin: require('./admin.model.js')(mongoose),
};

module.exports = db;