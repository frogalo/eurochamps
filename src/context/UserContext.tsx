// src/context/UserContext.tsx
"use client";

import {
    createContext,
    useState,
    useEffect,
    useContext,
    ReactNode,
} from "react";

// Define the structure of a user
interface User {
    id: string;
    name: string;
    // Add other relevant user fields like email, avatar, etc.
}

// Define the shape of the context value
interface UserContextType {
    currentUser: User | null;
    login: (user: User) => void;
    logout: () => void;
}

// Create the context with a default value (null initially)
export const UserContext = createContext<UserContextType | null>(null);

// Create the provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // To prevent hydration issues

    // Load user from localStorage on initial mount
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("currentUser");
            if (storedUser) {
                setCurrentUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.removeItem("currentUser"); // Clear corrupted data
        } finally {
            setLoading(false); // Finished loading
        }
    }, []); // Empty dependency array ensures this runs only once on mount

    // Save user to localStorage whenever currentUser changes
    useEffect(() => {
        if (!loading) {
            // Only save after initial load is complete
            if (currentUser) {
                localStorage.setItem("currentUser", JSON.stringify(currentUser));
            } else {
                localStorage.removeItem("currentUser");
            }
        }
    }, [currentUser, loading]);

    // Login function
    const login = (user: User) => {
        setCurrentUser(user);
    };

    // Logout function
    const logout = () => {
        setCurrentUser(null);
    };

    // Don't render children until loading is complete to avoid hydration mismatch
    if (loading) {
        return null; // Or a loading spinner
    }

    return (
        <UserContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook for easier context usage
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
