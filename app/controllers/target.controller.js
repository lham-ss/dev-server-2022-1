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
            console.log(err);
        })
};

const createPhoneNumber = async (E164Number) => {
    return PhoneNumbers.create({ E164Number })
        .then(docNumber => {
            console.log('--- E164 Number created: \n', docNumber);

            return docNumber;
        })
        .catch(async (err) => {
            console.log(err);

            let doc = await getPhoneNumber(E164Number);

            return doc;
        })
}


const getPhoneNumber = async (phoneNumber) => {
    const doc = await PhoneNumbers.find({ E164Number: phoneNumber });

    console.log(doc);

    return doc;
}

const attachPhoneNumber = async (phoneNumberId, targetId) => {
    return Targets.findByIdAndUpdate(
        targetId,
        { $push: { phoneNumbers: phoneNumberId } },
        { new: true, useFindAndModify: false }
    )
};

exports.create = async (req, res) => {
    let target = req.body;

    try {
        let doc = await createTarget(target);
        let num = await createPhoneNumber(target.E164Number);
        let final = await attachPhoneNumber(num._id, doc._id);

        res.status(200).json({ success: true, record: final })
    }
    catch (e) {
        res.status(200).json({ success: false, error: e });
    }

};