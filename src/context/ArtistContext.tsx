"use client";

import { createContext, useState } from "react";

interface Artist {
    id: number;
    name: string;
    rank: number;
}

interface ArtistContextType {
    artists: Artist[];
    setRank: (id: number, delta: number) => void;
}

export const ArtistContext = createContext<ArtistContextType | null>(null);

export const ArtistProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                            children,
                                                                        }) => {
    const [artists, setArtists] = useState<Artist[]>([
        { id: 1, name: "Diana G", rank: 0 },
        { id: 2, name: "Måns Zelmerlöw", rank: 0 },
        { id: 3, name: "Conchita Wurst", rank: 0 },
    ]);

    const setRank = (id: number, delta: number) => {
        setArtists((prev) =>
            prev.map((artist) =>
                artist.id === id ? { ...artist, rank: artist.rank + delta } : artist
            )
        );
    };

    return (
        <ArtistContext.Provider value={{ artists, setRank }}>
            {children}
        </ArtistContext.Provider>
    );
};
