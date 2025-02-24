import React, { createContext, useState, useContext, useEffect } from "react";

// Create the UserContext
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    // Initialize the user state with the value from localStorage (if it exists)
    const [user, setUser] = useState(() => {
        return localStorage.getItem("user") || null;
    });

    // Initialize the role state with the value from localStorage (if it exists)
    const [role, setRole] = useState(() => {
        return localStorage.getItem("role") === "true"; // Convert to boolean
    });

    // Save the user and role to localStorage whenever they change
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", user);
        } else {
            localStorage.removeItem("user");
            localStorage.removeItem("role");
        }
    }, [user]);

    useEffect(() => {
        localStorage.setItem("role", role); // Save role as a string
    }, [role]);

    return (
        <UserContext.Provider value={{ user, setUser, role, setRole }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);
