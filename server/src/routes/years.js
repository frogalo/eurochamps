const express = require('express');
const router = express.Router();
const { createYear, getAllYears } = require('../controllers/yearController'); // Import the controller

// Create a new year
router.post('/', createYear); // Use the controller for the POST route

// Get all years
router.get('/', getAllYears); // Use the controller for the GET route

module.exports = router;
