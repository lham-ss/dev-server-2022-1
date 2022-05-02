const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const db = {
    mongoose: mongoose,
    url: process.env.MONGODB_URI,

    user: require('./user.model.js')(mongoose),
    role: require('./role.model.js')(mongoose),
    target: require('./target.model')(mongoose),
    phonenumber: require('./phonenumber.model')(mongoose),

    ROLES: ["user", "admin", "moderator"],
};

module.exports = db;