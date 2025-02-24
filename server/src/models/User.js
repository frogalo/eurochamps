// server/src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot be more than 50 characters long']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    votes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vote'
    }]
}, {
    timestamps: true
});

// Add methods to the user schema
userSchema.methods = {
    // Method to add a vote
    addVote: async function(voteId) {
        this.votes.push(voteId);
        await this.save();
    },

    // Method to check if user has voted in a stage
    hasVotedInStage: function(stage) {
        return this.votes.some(vote => vote.stage === stage);
    }
};

// Add static methods to the schema
userSchema.statics = {
    // Find user by name
    findByName: function(name) {
        return this.findOne({ name });
    },

    // Get all users with their votes
    getAllWithVotes: function() {
        return this.find().populate('votes');
    }
};

// Add a pre-save hook
userSchema.pre('save', function(next) {
    // You can add any pre-save logic here
    next();
});

module.exports = mongoose.model('User', userSchema);
