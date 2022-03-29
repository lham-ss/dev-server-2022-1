const user = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');
const auth = require('../middleware/authJwt');
const express = require('express');

var router = express.Router();
var testRoutes = express.Router();

module.exports = app => {

    router.post("/", authController.createUser);  // create a new user document in mongo
    router.get("/", user.findAll);                // list all user
    router.get("/active", user.findAllActive);    // list all active admins
    router.get("/:id", user.findOne);             // find user by id
    router.put("/:id", user.update);              // update user by id
    router.delete("/:id", user.delete);           // delete user by id
    router.delete("/", user.deleteAll);           // delete everything (not active)

    app.use('/api/user',
        [auth.verifyToken],
        router
    );

    testRoutes.get('/all', user.allAccess);

    testRoutes.get('/user',
        [auth.verifyToken],
        user.userAccess
    );

    testRoutes.get('/mod',
        [auth.verifyToken, auth.isModerator],
        user.moderatorAccess
    );

    testRoutes.get('/admin',
        [auth.verifyToken, auth.isAdmin],
        user.adminAccess
    );

    app.use('/api/test', testRoutes); //wtf
}
