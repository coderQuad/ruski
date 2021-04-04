const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
    winning_team: [Schema.Types.ObjectId],
    losing_team: [Schema.Types.ObjectId],
    location: String, 
    description: String,
    comments: [Schema.Types.ObjectId],
    likes: Number
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);