// server/src/models/Stage.jsx
const mongoose = require('mongoose');

const stageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Stage name is required'],
        enum: ['countryQuali','polfinal1', 'polfinal2', 'final'], // Valid stage names
    },
    year: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Year', // Reference to Year schema
        required: true
    },
    votes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vote' // Reference to Vote schema
    }]
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Stage', stageSchema);
