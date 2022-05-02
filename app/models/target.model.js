// SMS/Email user targets model - lham 2022

module.exports = (mongoose) => {
    const schema = mongoose.Schema(
        {
            firstName: String,
            lastName: String,
            cellNumber: String,
            phoneNumbers: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'phonenumbers',
            }],
            email: {
                type: String,
                required: true
            },
            branch: String,
            clientId: String,
            field1: String,
            field2: String,
            field3: String,
        },
        {
            timestamps: true,
        }
    );

    schema.index({ email: 1 }, { unique: true });

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();

        object.id = _id;

        return object;
    });

    const model = mongoose.model('target', schema);

    return model;
}