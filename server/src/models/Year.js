// server/src/models/Year.js
const mongoose = require('mongoose');

const yearSchema = new mongoose.Schema({
    year: {
        type: Number,
        required: [true, 'Year is required'],
        unique: true, // Ensure no duplicate years
        min: [1956, 'Year must be 1956 or later'], // Eurovision started in 1956
    },
    stages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stage' // Reference to Stage schema
    }]
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Year', yearSchema);
