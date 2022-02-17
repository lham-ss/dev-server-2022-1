const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require("../models");

const Admin = db.admin;

// Create and Save a new document
exports.create = async (req, res) => {
    const { firstName, lastName, email, password, phoneNumber } = req.body;

    if (!email || !password) {
        return res.status(400).send({ status: false, auth: false, message: "Missing Parameters: email or password!" });
    }

    try {
        const hashed = bcrypt.hashSync(password, 8);

        const admin = await Admin.create({ firstName, lastName, phoneNumber, email, isActive: false, password: hashed });

        console.log(admin);

        const token = jwt.sign({ type: "admin", id: admin._id, email }, process.env.JWT_SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });

        return res.status(200).send({ auth: true, token: token, result: admin, message: "Successfully registered." });
    }
    catch (err) {
        console.trace(err);
        return res.status(500).send({ status: false, auth: false, message: err });
    }
};

// Retrieve all documents from the database.
exports.findAll = async (req, res) => {
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
exports.findAllActive = (req, res) => {

};