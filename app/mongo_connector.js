const db = require("./models");

let connection = null;

async function connectToDatabase() {
    return new Promise((resolve, reject) => {

        let mongoOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        db.mongoose.connect(db.url, mongoOptions).catch((err) => reject(err));

        connection = db.mongoose.connection;

        connection.once('open', () => {
            console.log('MongoDB Atlas database connection established successfully!');
            resolve(true);
        });

        connection.on('error', (err) => {
            console.log("MongoDB Atlas connection error. (Did you add this IP to the Mongo Atlas WhiteList?)\n");
            reject(err);
        });
    })
}

module.exports = {
    GetConnection: () => connection,

    connectToDatabase,
};