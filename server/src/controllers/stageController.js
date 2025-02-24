const { Stage, Year} = require('../models');

// Controller to create a new stage
const createStage = async (req, res) => {
    const { name, year: yearId } = req.body;

    try {
        // Find the year
        const year = await Year.findById(yearId);
        if (!year) {
            return res.status(404).json({ message: 'Year not found' });
        }

        // Create a new stage
        const newStage = new Stage({ name, year: yearId });
        await newStage.save();

        // Add the stage to the year's stages array
        year.stages.push(newStage._id);
        await year.save();

        res.status(201).json(newStage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controller to get all stages
const getAllStages = async (req, res) => {
    try {
        const stages = await Stage.find().populate('year'); // Populate year if needed
        res.status(200).json(stages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller to get a single stage by ID
const getStageById = async (req, res) => {
    const { stageId } = req.params;
    try {
        const stage = await Stage.findById(stageId).populate('year'); // Populate year if needed
        if (!stage) {
            return res.status(404).json({ message: 'Stage not found' });
        }
        res.status(200).json(stage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createStage,
    getAllStages,
    getStageById,
};