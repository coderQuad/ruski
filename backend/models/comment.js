const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    text: String,
    likes: Number,
    user_id: Schema.Types.ObjectId 
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);