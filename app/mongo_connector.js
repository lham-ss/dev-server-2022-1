const db = require("./models");

let connection = null;

async function connectToDatabase() {
    return new Promise(async (resolve, reject) => {

        let mongoOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        try {
            db.mongoose.connect(db.url, mongoOptions);

            connection = db.mongoose.connection;

            connection.once('open', () => {
                console.log('--- MongoDB connection established...');
                resolve(true);
            });

            connection.on('error', (err) => {
                console.log("--- MongoDB connection error. (Did you add this IP to the Mongo Atlas WhiteList?)");
                reject(err);
            });
        }
        catch (err) {
            console.log('--- Error caught in mongo_connector...');
            console.trace(err);
            reject(err);
        }
    })
}

module.exports = {
    GetConnection: () => connection,

    connectToDatabase,
};