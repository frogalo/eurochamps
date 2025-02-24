// server/src/routes/votes.js
const express = require('express');
const router = express.Router();
const { User, Vote } = require('../models');

// Submit a vote
router.post('/', async (req, res) => {
    try {
        const { userId, stage, voteValue } = req.body;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user has already voted in this stage
        const existingVote = await Vote.findOne({ userVote: userId, stage });
        if (existingVote) {
            return res.status(400).json({ message: 'User has already voted in this stage' });
        }

        // Create new vote
        const vote = new Vote({
            stage,
            vote: voteValue,
            userVote: userId
        });

        // Save the vote
        await vote.save();

        // Add vote to user's votes array
        await user.addVote(vote._id);

        res.status(201).json({ message: 'Vote submitted successfully', vote });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get votes for a stage
router.get('/:stage', async (req, res) => {
    try {
        const { stage } = req.params;
        const votes = await Vote.find({ stage }).populate('userVote', 'name');
        res.json(votes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
