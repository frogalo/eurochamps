const API_URL = process.env.REACT_APP_API_URL + "/stages"; // Base URL for the API
// Function to add a new stage
export const addStage = async (stage) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(stage),
        });

        if (!response.ok) {
            throw new Error("Failed to add stage");
        }

        return await response.json(); // Return the created stage data
    } catch (error) {
        console.error("Error adding stage:", error);
        throw error; // Rethrow the error for handling in the component
    }
};
// Function to fetch all stages
export const getStages = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch stages");
        }
        return await response.json(); // Return the fetched stages data
    } catch (error) {
        console.error("Error fetching stages:", error);
        throw error; // Rethrow the error for handling in the component
    }
};

// Function to fetch a single stage by ID
export const getStageById = async (stageId) => {
    try {
        const response = await fetch(`${API_URL}/${stageId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch stage with ID: ${stageId}`);
        }
        return await response.json(); // Return the fetched stage data
    } catch (error) {
        console.error(`Error fetching stage with ID ${stageId}:`, error);
        throw error; // Rethrow the error for handling in the component
    }
};