const { User } = require('../models');

// Controller to create a new user
const createUser = async (req, res) => {
    const { name, isAdmin } = req.body;

    try {
        const newUser = new User({ name, isAdmin });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controller to get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createUser,
    getAllUsers,
};
