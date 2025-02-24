const express = require('express');
const router = express.Router();
const { createUser, getAllUsers } = require('../controllers/userController'); // Import the controller

// Create a new user
router.post('/', createUser); // Use the controller for the POST route

// Get all users
router.get('/', getAllUsers); // Use the controller for the GET route

module.exports = router;
