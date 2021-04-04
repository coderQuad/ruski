const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const helloSchema = new Schema({
    name: String,
    type: String
});

module.exports = mongoose.model('Hello', helloSchema);