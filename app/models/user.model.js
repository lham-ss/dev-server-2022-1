// User accounts model - lham 2022

module.exports = (mongoose) => {
    const schema = mongoose.Schema(
        {
            firstName: String,
            lastName: String,
            phoneNumber: String,
            isActive: { type: Boolean, required: true, default: true },
            email: { type: String, required: true },
            password: { type: String, required: true },
            roles: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Role"
                }
            ],
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

    const model = mongoose.model('user', schema);

    return model;
}
