const db = require("../models");

const Targets = db.target;
const PhoneNumbers = db.phonenumber;

const createTarget = async (target) => {
    return Targets.create(target)
        .then(docTarget => {
            console.log('--- Created Target: \n', docTarget);

            return docTarget;
        })
        .catch(err => {
            throw err;
        })
};

const createPhoneNumber = async (E164Number) => {
    return PhoneNumbers.create({ E164Number })
        .then(docNumber => {
            console.log('--- E164 Number created: \n', docNumber);
            return docNumber;
        })
        .catch(async (err) => {
            if (err.code === 11000) { // duplicate found
                let doc = await getPhoneNumber(E164Number);
                return doc;
            }
            throw err;
        })
}


const getPhoneNumber = async (phoneNumber) => {
    const doc = await PhoneNumbers.find({ E164Number: phoneNumber });
    return doc;
}

const attachPhoneNumber = async (phoneNumberId, targetId) => {
    return Targets.findByIdAndUpdate(
        targetId,
        { $push: { phoneNumbers: phoneNumberId } },
        { new: true, useFindAndModify: false }
    ).populate('phoneNumbers', '-__v');
};

exports.create = async (req, res) => {
    let target = req.body;

    Promise.all([createTarget(target), createPhoneNumber(target.E164Number)])
        .then(async ([doc, num]) => {
            if (doc && num) {
                let final = await attachPhoneNumber(num._id, doc._id);

                res.status(200).json({ success: true, record: final })
            }
        })
        .catch((e) => {
            res.status(500).json({ success: false, error: true, message: 'Server error.', err: e });
        })
};


exports.findAll = async (req, res) => {
    try {
        let all = await Targets.find({}).populate('phoneNumbers', '-__v -_id');

        res.status(200).send({ targets: all });
    }
    catch (err) {
        console.trace(err);
        res.status(500).json({ error: true, message: err });
    }
}


exports.findOne = async (req, res) => {
    const id = req.params.id;

    if (!id) return res.status(400).send({ error: true, auth: false, message: "Missing Parameters: id" });

    try {
        const target = await Targets.findById(id).populate('phoneNumbers', '-__v -_id');

        return res.status(200).send({ result: target, message: "Success." })
    } catch (error) {
        console.trace(error);

        return res.status(500).send({ error: true, status: false, message: error });
    }
};
