"use client";

import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext<{
    theme: "light" | "dark";
    toggleTheme: () => void;
}>({
    theme: "light",
    toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
