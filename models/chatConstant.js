const  mongoose = require ('mongoose');
const { Schema } = mongoose;

const constantSchma = new Schema({
    "participants": [], // IDs of participants in the chat
    "last_message": {
        "timestamp": Date, // Timestamp of the last message
        "message": String // Content of the last message
    }
});

module.exports = mongoose.model('constant', constantSchma);
