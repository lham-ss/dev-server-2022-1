const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require("../models");

const User = db.user;
const Role = db.role;

/*
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ auth: false, error: true, message: "Missing Parameters: email or password!" });
    }
    try {
        let admin = await Admin.findOne({ email });
        console.log('admin ===> ', admin);

        if (!admin) {
            return res.status(401).send({ auth: false, error: true, message: "No user was found with those credentials." });
        }

        if (!admin.isActive) {
            return res.status(401).send({ auth: false, error: true, message: "That user has not yet been set to active!" })
        }


        var passwordIsValid = bcrypt.compareSync(password, admin.password);

        if (!passwordIsValid) return res.status(401).send({ auth: false, error: true, message: "Your password is wrong fuckface." });

        var token = jwt.sign({ type: "admin", id: admin._id, email }, process.env.JWT_SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });

        admin = admin.toObject();
        delete admin.password;

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
*/

exports.createUser = (req, res) => {
    const { email, password, roles, firstName, lastName, phoneNumber } = req.body;

    const user = new User({
        email,
        firstName,
        lastName,
        phoneNumber,
        isActive: true,
        password: bcrypt.hashSync(password, 8)
    });

    user.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (roles) {
            Role.find(
                {
                    name: { $in: roles }
                },
                (err, roles) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    user.roles = roles.map(role => role._id);
                    user.save(err => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }
                        res.send({ message: "User (with assigned roles) was registered successfully!" });
                    });
                }
            );
        }
        else {
            Role.findOne({ name: "user" }, (err, role) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                user.roles = [role._id];
                user.save(err => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    res.send({ message: "User (with basic role) was registered successfully!" });
                });
            });
        }

    });
}


exports.signin = (req, res) => {
    const { email, password } = req.body;

    User.findOne({
        email: email
    })
        .populate("roles", "-__v")
        .exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!user) {
                return res.status(404).send({ message: "Email Not found." });
            }

            var passwordIsValid = bcrypt.compareSync(password, user.password);

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            var authorities = [];

            for (let i = 0; i < user.roles.length; i++) {
                authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
            }

            res.status(200).send({
                id: user._id,
                email: user.email,
                roles: authorities,
                accessToken: token
            });
        });
};