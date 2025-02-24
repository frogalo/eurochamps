// server/src/models/Vote.js
const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    stage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stage', // Reference to Stage schema
        required: true
    },
    userVote: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to User schema
        required: true
    },
    ranking: [
        {
            artist: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Artist', // Reference to Artist schema
                required: true
            },
            rank: {
                type: Number,
                required: true,
                min: [1, 'Rank must be at least 1']
            }
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('Vote', voteSchema);
