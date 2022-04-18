const express = require('express');
const fileUpload = require('express-fileupload');
const uploads = require('../controllers/upload.controller');

var router = express.Router();

let uploadOptions = {
    safeFileNames: true,

};

module.exports = app => {

    router.post('/targets-csv', uploads.uploadCsvFile);

    app.use('/api/upload', fileUpload(uploadOptions), router);
}