const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require("../models");

const User = db.user;
const Role = db.role;


exports.updateIsActive = async (req, res) => {
    const userId = req.params.id;
    const isActive = req.body.status;

    try {
        if (req.userId == userId)
            return res.status(200).send({ message: 'You cannot change your own isActive status.' });

        let user = await User.updateOne({ _id: userId }, { isActive: isActive });

        return res.status(200).send({ result: user, message: "Changed isActive status of the user" })
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ error: true, status: 500, message: error });
    }
};

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


exports.login = (req, res) => {
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

            var token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
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