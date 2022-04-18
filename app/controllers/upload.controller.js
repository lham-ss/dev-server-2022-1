
exports.uploadCsvFile = (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let file = req.files.csvFile;
    let uploadPath = __dirname + '/csv-uploads/' + file.name;

    file.mv(uploadPath, (err) => {
        if (err)
            return res.status(500).send(err);

        res.status(200).json({ 'uploaded': true })
    });
}