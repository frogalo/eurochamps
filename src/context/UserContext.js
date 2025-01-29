// src/UserContext.js
import React, { createContext, useState, useContext, useEffect } from "react";

// Create the UserContext
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    // Initialize the user state with the value from localStorage (if it exists)
    const [user, setUser] = useState(() => {
        return localStorage.getItem("user") || null;
    });

    // Save the user to localStorage whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", user);
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);
