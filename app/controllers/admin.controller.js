const db = require("../models");

const Admin = db.admin;

// Create and Save a new document
exports.create = (req, res) => {
    const { firstName, lastName, email, password, phoneNumber } = req.body;

    if (!email || !password) {
        return res.status(400).send({ auth: false, message: "Missing Parameters: email or password!" });
    }


};

// Retrieve all documents from the database.
exports.findAll = (req, res) => {
    try {
        let all = await Admin.find({});

        res.status(200).send({ error: false, admins: all });
    }
    catch (err) {
        console.trace(err);
        res.status(500).json({ error: true, message: err });
    }
}

// Find a single document with an id
exports.findOne = (req, res) => {

};

// Update a document by the id in the request
exports.update = (req, res) => {

};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {

};

// Delete all documents from the database.
exports.deleteAll = (req, res) => {

};

// Find all active admins
exports.findAllActiveAdmins = (req, res) => {

};