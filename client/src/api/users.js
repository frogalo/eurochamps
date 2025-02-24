const API_URL = process.env.REACT_APP_API_URL + "/users"; // Base URL for the API

// Function to add a new user
export const addUser = async (name) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, isAdmin: false }), // Default isAdmin to false
        });

        if (!response.ok) {
            throw new Error("Failed to add user");
        }

        return await response.json(); // Return the created user data
    } catch (error) {
        console.error("Error adding user:", error);
        throw error; // Rethrow the error for handling in the component
    }
};

// Function to fetch all users
export const fetchUsers = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return await response.json(); // Return the fetched user data
    } catch (error) {
        console.error("Failed to fetch users:", error);
        throw error; // Rethrow the error for handling in the component
    }
};
