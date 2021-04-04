const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    handle: String, 
    name: String, 
    email: String,
    elo: Number,
    friend_ids: [Schema.Types.ObjectId]
})

module.exports = mongoose.model('User', userSchema);