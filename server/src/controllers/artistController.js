const { Artist } = require('../models');

// Controller to create a new artist
const createArtist = async (req, res) => {
    try {
        const newArtist = new Artist(req.body);
        await newArtist.save();
        res.status(201).json(newArtist);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controller to get all artists for a specific stage
const getArtistsForStage = async (req, res) => {
    const { stageId } = req.params;
    try {
        const artists = await Artist.find({ stage: stageId });
        res.status(200).json(artists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createArtist,
    getArtistsForStage,
};
