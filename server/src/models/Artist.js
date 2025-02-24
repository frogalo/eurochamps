// server/src/models/Artist.js
const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Artist name is required'],
        trim: true,
        minlength: [2, 'Artist name must be at least 2 characters long'],
        maxlength: [100, 'Artist name cannot exceed 100 characters']
    },
    country: {
        type: String,
        required: [true, 'Country of origin is required'],
        trim: true
    },
    songUrl: {
        type: String,
        required: [true, 'Song URL is required'],
    },
    songTitle: {
        type: String,
        required: [true, 'Song title is required'],
        trim: true
    },
    stage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stage', // Reference to Stage model
        required: true
    },
    imageUrl: {
        type: String,
    },
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Artist', artistSchema);
