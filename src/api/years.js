const API_URL = "http://localhost:5000/api/years"; // Base URL for the API

// Function to add a new year
export const addYear = async (year) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ year }), // Send the year in the request body
        });

        if (!response.ok) {
            throw new Error("Failed to add year");
        }

        return await response.json(); // Return the created year data
    } catch (error) {
        console.error("Error adding year:", error);
        throw error; // Rethrow the error for handling in the component
    }
};

// Function to fetch all years
export const fetchYears = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return await response.json(); // Return the fetched year data
    } catch (error) {
        console.error("Failed to fetch years:", error);
        throw error; // Rethrow the error for handling in the component
    }
};
