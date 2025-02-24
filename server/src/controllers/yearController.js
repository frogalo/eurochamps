const {Year} = require('../models');

// Controller to create a new year
const createYear = async (req, res) => {
    const {year} = req.body;

    try {
        const newYear = new Year({year});
        await newYear.save();
        res.status(201).json(newYear);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

// Controller to get all years
const getAllYears = async (req, res) => {
    try {
        const years = await Year.find().populate('stages'); // Populate stages if needed
        res.status(200).json(years);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = {
    createYear,
    getAllYears,
};
