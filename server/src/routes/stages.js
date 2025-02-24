const express = require('express');
const router = express.Router();
const { createStage, getAllStages, getStageById} = require('../controllers/stageController'); // Import the controller

// Create a new stage
router.post('/', createStage); // Use the controller for the POST route

// Get all stages
router.get('/', getAllStages); // Use the controller for the GET route

// Get a single stage by ID
router.get('/:stageId', getStageById); // Use the controller for the GET route
module.exports = router;
