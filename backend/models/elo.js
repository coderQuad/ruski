const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eloSchema = new Schema({
    elo: Number
}, {timestamps: true});

module.exports = mongoose.model('Elo', eloSchema);