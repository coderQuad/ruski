const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    handle: String, 
    name: String, 
    email: String,
    elo: Number,
    elo_history_ids: [Schema.Types.ObjectId],
    friend_ids: [Schema.Types.ObjectId],
    profile_url: String
});

module.exports = mongoose.model('User', userSchema);