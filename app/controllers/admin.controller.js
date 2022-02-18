const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require("../models");

const Admin = db.admin;

// Create and Save a new document
exports.create = async (req, res) => {
    const { firstName, lastName, email, password, phoneNumber } = req.body;

    if (!email || !password) {
        return res.status(400).send({ error: true, message: "Missing Parameters: email or password!" });
    }

    try {
        const hashed = bcrypt.hashSync(password, 8);

        const admin = await Admin.create({ firstName, lastName, phoneNumber, email, isActive: false, password: hashed });

        const token = jwt.sign({ type: "admin", id: admin._id, email }, process.env.JWT_SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });

        return res.status(200).send({ auth: true, token: token, result: admin, message: "Successfully created." });
    }
    catch (err) {
        console.trace(err);
        return res.status(500).send({ error: true, auth: false, message: err });
    }
};

// Retrieve all documents from the database.
exports.findAll = async (req, res) => {
    try {
        let all = await Admin.find({});

        res.status(200).send({ admins: all });
    }
    catch (err) {
        console.trace(err);
        res.status(500).json({ error: true, message: err });
    }
}

// Find a single document with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;

    if (!id) return res.status(400).send({ error: true, auth: false, message: "Missing Parameters: id" });

    try {
        const admin = await Admin.findById(id);

        return res.status(200).send({ result: admin, message: "Success." })
    } catch (error) {
        console.trace(error);

        return res.status(500).send({ error: true, status: false, message: error });
    }
};

// Update a document by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;
    const { firstName, lastName, email, phoneNumber } = req.body;

    if (!id || !firstName || !lastName || !email) {
        return res.status(400).send({ error: true, message: "Missing Parameters!" })
    }

    try {
        const admin = await Admin.updateOne({ _id: id }, { firstName, lastName, email, phoneNumber });

        return res.status(200).send({ result: admin, message: "Update the admin successfully!" })
    } catch (error) {
        console.trace(error);

        return res.status(500).send({ error: true, message: error });
    }
};

// Delete an admin with the specified id in the request
exports.delete = async (req, res) => {
    const id = req.params.id;

    // req.id will be set in auth.middleware
    if (!id || !req.id) {
        return res.status(400).send({ error: true, message: "Missing Parameters!" })
    }

    if (req.id == id) {
        return res.status(200).send({ error: true, message: "You cannot delete your own account." })
    }

    try {
        const deletedAdmin = await Admin.deleteOne({ _id: id });

        return res.status(200).send({ status: true, result: deletedAdmin, message: "Removed the admin successfully." })
    }
    catch (error) {
        console.error(error);

        return res.status(500).send({ error: true, message: error });
    }
};

// Delete all documents from the database.
exports.deleteAll = async (req, res) => {
    res.status(200).send({ message: 'deleteAll route is unavailable for admins.' })
};

// Find all active admins
exports.findAllActive = async (req, res) => {
    try {
        let all = await Admin.find({ isActive: true });

        res.status(200).send({ admins: all });
    }
    catch (err) {
        console.trace(err);
        res.status(500).json({ error: true, message: err });
    }
};