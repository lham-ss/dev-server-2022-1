const fs = require('fs');
const csvParse = require('csv-parse');
const { v4: uuidv4 } = require('uuid');

const phoneLibUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const phoneLibFormat = require('google-libphonenumber').PhoneNumberFormat;

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
    let cellNumber = '', e164Number = '', validNumber = false;

    if (record.cellNumber) {
        try {
            let num = phoneLibUtil.parseAndKeepRawInput(record.cellNumber, record.phoneRegion ?? 'US');

            validNumber = phoneLibUtil.isValidNumber(num);
            if (validNumber) {
                cellNumber = phoneLibUtil.format(num, phoneLibFormat.NATIONAL);
                e164Number = phoneLibUtil.format(num, phoneLibFormat.E164);
            }
            else cellNumber = record.cellNumber;
        }
        catch (e) {
            console.trace(e);
        }
    }

    return {
        email: record.email ?? '',
        firstName: record.firstName ?? '',
        lastName: record.lastName ?? '',
        cellNumber: cellNumber,
        e164Number: e164Number,
        isValidNumber: validNumber,
        clientId: record.clientId ?? '',
        branch: record.branch ?? '',
    }
};

const MAX_LINES = 25;

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
                if (err) reject(err);
                else if (data?.length) {               // csvParse returns array of data
                    for (ob of data) recs.push(ob);
                }
                else console.log('Not sure what to do with: ' + data);
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
    let uploadPath = '/tmp/' + uuidv4() + '.csv';

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




