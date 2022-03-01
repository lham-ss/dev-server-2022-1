

module.exports = (mongoose) => {
    const schema = mongoose.Schema({ name: String });
    const model = mongoose.model('Role', schema);

    return model;
}