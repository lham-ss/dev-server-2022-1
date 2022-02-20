module.exports = app => {
    const admin = require('../controllers/admin.controller');

    const { isUserAuthenticated } = require('../middleware/auth.middleware');

    var router = require('express').Router();

    router.post("/", admin.create);                // create a new admin document in mongo
    router.get("/", admin.findAll);                // list all admins
    router.get("/active", admin.findAllActive);    // list all active admins
    router.get("/:id", admin.findOne);             // find admin by id
    router.put("/:id", admin.update);              // update admin by id
    router.delete("/:id", admin.delete);           // delete admin by id
    router.delete("/", admin.deleteAll);           // delete everything

    app.use('/api/admin', isUserAuthenticated, router);
}
