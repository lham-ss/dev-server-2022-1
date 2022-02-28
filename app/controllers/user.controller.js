const db = require("../models");

const Users = db.user;

exports.findAll = async (req, res) => {
    try {
        let all = await Users.find({});

        res.status(200).send({ users: all });
    }
    catch (err) {
        console.trace(err);
        res.status(500).json({ error: true, message: err });
    }
}


exports.findOne = async (req, res) => {
    const id = req.params.id;

    if (!id) return res.status(400).send({ error: true, auth: false, message: "Missing Parameters: id" });

    try {
        const user = await Users.findById(id);

        return res.status(200).send({ result: user, message: "Success." })
    } catch (error) {
        console.trace(error);

        return res.status(500).send({ error: true, status: false, message: error });
    }
};


exports.update = async (req, res) => {
    const id = req.params.id;
    const { firstName, lastName, email, phoneNumber } = req.body;

    if (!id || !firstName || !lastName || !email) {
        return res.status(400).send({ error: true, message: "Missing Parameters!" })
    }

    try {
        const user = await Users.updateOne({ _id: id }, { firstName, lastName, email, phoneNumber });

        return res.status(200).send({ result: user, message: "Update the admin successfully!" })
    } catch (error) {
        console.trace(error);

        return res.status(500).send({ error: true, message: error });
    }
};


exports.delete = async (req, res) => {
    const id = req.params.id;

    if (!id || !req.userId) {
        return res.status(400).send({ error: true, message: "Missing Parameters!" })
    }

    if (req.id == id) {
        return res.status(200).send({ error: true, message: "You cannot delete your own account." })
    }

    try {
        const deleted = await Users.deleteOne({ _id: id });

        return res.status(200).send({ status: true, result: deleted, message: "Removed user successfully." })
    }
    catch (error) {
        console.error(error);

        return res.status(500).send({ error: true, message: error });
    }
};


exports.deleteAll = async (req, res) => {
    res.status(200).send({ message: 'deleteAll route is unavailable for users.' })
};


exports.findAllActive = async (req, res) => {
    try {
        let all = await Users.find({ isActive: true });

        res.status(200).send({ users: all });
    }
    catch (err) {
        console.trace(err);
        res.status(500).json({ error: true, message: err });
    }
};

// for testing roles :)
exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userAccess = (req, res) => {
    res.status(200).send("User Content.");
};

exports.adminAccess = (req, res) => {
    res.status(200).send("Admin Content.");
};

exports.moderatorAccess = (req, res) => {
    res.status(200).send("Moderator Content.");
};