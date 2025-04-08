"use client";

import "./globals.css";
import { ArtistProvider } from "@/context/ArtistContext";
import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <ThemeProvider>
            <ArtistProvider>
                {children}
            </ArtistProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
