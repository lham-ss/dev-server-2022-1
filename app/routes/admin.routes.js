module.exports = app => {
    const admin = require('../controllers/admin.controller');

    const { isUserAuthenticated } = require('../middleware/auth.middleware');

    var router = require('express').Router();

    router.post("/", isUserAuthenticated, admin.create);                // create a new admin document in mongo
    router.get("/", isUserAuthenticated, admin.findAll);                // list all admins
    router.get("/active", isUserAuthenticated, admin.findAllActive);    // list all active admins
    router.get("/:id", isUserAuthenticated, admin.findOne);             // find admin by id
    router.put("/:id", isUserAuthenticated, admin.update);              // update admin by id
    router.delete("/:id", isUserAuthenticated, admin.delete);           // delete admin by id
    router.delete("/", isUserAuthenticated, admin.deleteAll);           // delete everything

    app.use('/api/admin', router);
}
