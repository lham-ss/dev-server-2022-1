const fs = require('fs');
const csvParse = require('csv-parse');

const { finished } = require('stream');
const { camelCase } = require('lodash');

const openCSVFileStream = (fileName) => {
    return new Promise((resolve, reject) => {
        let csvStream;

        try {
            csvStream = fs.createReadStream(fileName);
            console.log(`Processing CSV file "${fileName}"...`);
            resolve(csvStream);
        }
        catch (e) {
            console.trace(e);
            reject(e);
        }
    })
}

const onRecordFunction = (record, data) => {
    return {
        email: record.email ?? '',
        firstName: record.firstName ?? '',
        lastName: record.lastName ?? '',
        cellNumber: record.cellNumber ?? '',
        clientId: record.clientId ?? '',
    }
};

const MAX_LINES = 4;

const processCSVStream = (stream) => {
    return new Promise((resolve, reject) => {
        let recs = [];

        let options = {
            relax: true,
            columns: headers => headers.map(col => camelCase(col)),
            on_record: onRecordFunction,
            from_line: 1,
            skip_empty_lines: true,
            to_line: MAX_LINES,
            trim: true,
        }

        stream.pipe(
            csvParse.parse(options, (err, data) => {
                err ? console.trace(err) : recs.push(data);
            })
        );

        finished(stream, (err) => {
            err ? reject(err) : resolve(recs);
        });
    });
}


exports.uploadCsvFile = (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let file = req.files.csvFile;
    let uploadPath = '/tmp/' + file.name + '.csv';

    console.log(uploadPath);

    file.mv(uploadPath, async (err) => {
        if (err)
            return res.status(500).json({ error: true, errorMessage: 'Server error.', err: err });

        let recs = [];

        try {
            let stream = await openCSVFileStream(uploadPath);
            recs = await processCSVStream(stream);
        }
        catch (e) {
            console.trace(e);

            return res.status(500).json({ error: true, errorMessage: 'Error while parsing CSV file.', err: e });
        }

        res.status(200).json({ 'uploaded': true, error: false, results: recs })
    });
}




