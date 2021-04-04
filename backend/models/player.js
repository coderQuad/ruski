const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
    cups: Number,
    penalties: Number,
    user_id: Schema.Types.ObjectId
});

module.exports = mongoose.model('Player', playerSchema);