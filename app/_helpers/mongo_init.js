const db = require('../models');
const bcrypt = require('bcryptjs');

const Role = db.role;
const User = db.user;

exports.initRoles = () => {
    return new Promise((resolve, reject) => {
        Role.estimatedDocumentCount((err, count) => {
            if (!err && count === 0) {
                new Role({
                    name: "user"
                }).save(err => {
                    if (err) {
                        console.log("error", err);
                        reject(err);
                    }
                    console.log("--- added 'user' to roles collection");
                });

                new Role({
                    name: "moderator"
                }).save(err => {
                    if (err) {
                        console.log("error", err);
                        reject(err);
                    }
                    console.log("--- added 'moderator' to roles collection");
                });

                new Role({
                    name: "admin"
                }).save(err => {
                    if (err) {
                        console.log("error", err);
                        reject(err);
                    }
                    console.log("--- added 'admin' to roles collection");
                    resolve(true);
                });
            }
            else resolve(false);
        })
    });
}


var password = 'admin';

var defaultAdmin = {
    isActive: true,
    firstName: 'Default',
    lastName: 'Admin',
    email: 'admin@localhost',
    password: bcrypt.hashSync(password, 8),
};

exports.initUsers = () => {
    return new Promise((resolve, reject) => {
        User.estimatedDocumentCount((err, count) => {
            if (!err && count === 0) {
                new User(
                    defaultAdmin
                ).save((err, user) => {
                    if (err) {
                        console.log("error", err);
                        reject(err);
                    }
                    console.log("--- added default admin to users collection");
                    console.log(`    --- login: ${defaultAdmin.email}`);
                    console.log(`    --- password: ${password}`);

                    if (db.ROLES) {
                        Role.find(
                            {
                                name: { $in: db.ROLES }
                            },
                            (err, roles) => {
                                if (err) {
                                    console.log('--- Error setting roles in default user.')
                                    reject(err);
                                }
                                user.roles = roles.map(role => role._id);
                                user.save(err => {
                                    if (err) {
                                        console.log('--- Error setting roles in default user.')
                                        reject(err)
                                    }

                                    resolve(true);
                                });
                            }
                        );
                    }
                    else resolve(true);
                });
            }
            else resolve(false);
        });
    })
}