const express = require('express');
const router = express.Router();
const { createArtist, getArtistsForStage } = require('../controllers/artistController'); // Import the controller

// Create a new artist
router.post('/', createArtist); // Use the controller for the POST route

// Get all artists for a specific stage
router.get('/:stageId', getArtistsForStage); // Use the controller for the GET route

module.exports = router;
