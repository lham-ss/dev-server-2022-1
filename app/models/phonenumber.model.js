

module.exports = (mongoose) => {
    const schema = new mongoose.Schema({
        E164Number: String,
        isStopped: {
            type: Boolean,
            default: false,
        },
        isIgnored: {
            type: Boolean,
            default: false,
        },
        totalOutgoing: {
            type: Number,
            default: 0,
        },
        totalIncoming: {
            type: Number,
            default: 0,
        },
        lastSent: Date,
        lastReceived: Date,
    });

    schema.index({ E164Number: 1 }, { unique: true });

    const model = mongoose.model('phonenumbers', schema);

    return model;
};