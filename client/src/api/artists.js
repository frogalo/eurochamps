const API_URL = process.env.REACT_APP_API_URL + "/artists"; // Base URL for the API

// Function to add a new artist
export const addArtist = async (artist) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(artist),
        });

        if (!response.ok) {
            throw new Error("Failed to add artist");
        }

        return await response.json(); // Return the created artist data
    } catch (error) {
        console.error("Error adding artist:", error);
        throw error; // Rethrow the error for handling in the component
    }
};

// Function to fetch all artists for a specific stage
export const getArtistsForStage = async (stageId) => {
    try {
        console.log('stageId', stageId);
        const response = await fetch(`${API_URL}/${stageId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch artists");
        }
        return await response.json(); // Return the fetched artists data
    } catch (error) {
        console.error("Error fetching artists:", error);
        throw error; // Rethrow the error for handling in the component
    }
};
