const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { verifyWebToken } = require('../jwt_auth');

const db = require("../models");

const Admin = db.admin;

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ auth: false, error: true, message: "Missing Parameters: email or password!" });
    }
    try {
        const admin = await Admin.findOne({ email });

        if (!admin || !admin.isActive) {
            return res.status(401).send({ auth: false, error: true, message: "The admin has not yet been set to active!" })
        }

        console.log('admin ===> ', admin);

        var passwordIsValid = bcrypt.compareSync(password, admin.password);

        if (!passwordIsValid) return res.status(401).send({ auth: false, error: true, message: "The credentials are wrong!" });

        var token = jwt.sign({ type: "admin", id: admin._id, email }, process.env.JWT_SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });

        return res.status(200).send({ auth: true, token: token, result: admin });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ auth: false, error: true, message: error });
    }
};

exports.activateAccount = async (req, res) => {
    const willActivateId = req.params.id;
    const activeStatus = req.body.status;

    const token = req.headers['auth-token'];

    if (!token) {
        return res.status(403).json({ error: true, status: 403, message: 'FORBIDDEN' });
    }

    try {
        await verifyWebToken(token).then(async (adminInfo) => {
            const operatedAdmin = await Admin.findById(adminInfo.id);

            if (!operatedAdmin.isActive) {
                return res.status(200).send({ error: true, message: "You don't have the permission yet!" })
            }

            const updatedAdmin = await Admin.updateOne({ _id: willActivateId }, { isActive: activeStatus });

            return res.status(200).send({ result: updatedAdmin, message: "Changed isActive status of the user" })
        })
            .catch((err) => {
                console.error(err);
                return res.status(401).json({ error: true, status: 401, message: 'UNAUTHORIZED' });
            });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: true, status: 500, message: error });
    }
};