"use client";

import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";

export default function Home() {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-end mb-4">
                <button
                    className="px-4 py-2 rounded"
                    style={{
                        backgroundColor: theme === "light" ? "#33A65B" : "#D9A441",
                    }}
                    onClick={toggleTheme}
                >
                    {theme === "light" ? "🌙 Dark" : "☀️ Light"}
                </button>
            </div>
            {/* Existing artist list */}
        </div>
    );
}
