const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    sessionId: String,
    messages: [
        {
            role: String,
            content: String
        }
    ]
});

module.exports = mongoose.model('Conversation', conversationSchema);
    