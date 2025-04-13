"use client";

import {
    createContext,
    useState,
    useEffect,
    useContext,
    ReactNode,
} from "react";

interface UserContextType {
    currentUser: string | null;
    login: (name: string) => void;
    logout: () => void;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
            setCurrentUser(storedUser);
        }
    }, []);

    // Save or remove the current user in localStorage based on state
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem("currentUser", currentUser);
        } else {
            localStorage.removeItem("currentUser");
        }
    }, [currentUser]);

    const login = (name: string) => {
        setCurrentUser(name);
    };

    const logout = () => {
        setCurrentUser(null);
    };

    return (
        <UserContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
