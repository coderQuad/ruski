const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
    winning_team_player_ids: [Schema.Types.ObjectId],
    losing_team_player_ids: [Schema.Types.ObjectId],
    location: String, 
    description: String,
    comment_ids: [Schema.Types.ObjectId],
    likes: Number,
    liked_by_ids: [Schema.Types.ObjectId]
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);