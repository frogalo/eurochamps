import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // For getting route parameters
import { ArtistCard } from "../elements/ArtistCard"; // Import the ArtistCard component
import { StageContainer } from "./Stage.styles"; // Import styles for the stage

const Stage = () => {
    const { stageId } = useParams(); // Get the stage ID from the URL
    const [artists, setArtists] = useState([]); // State to store artists

    useEffect(() => {
        // Fetch artists for the selected stage
        const fetchArtists = async () => {
            try {
                const response = await fetch("/data/artists.json"); // Update the path here
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                // console.log("Fetched data:", data); // Log the fetched data
                // Filter artists based on the selected stage
                const stageArtists = data.filter(artist => artist.stage === stageId);
                console.log("Stage Artists:", stageArtists); // Log the filtered artists
                setArtists(stageArtists);
            } catch (error) {
                console.error("Failed to fetch artists:", error);
            }
        };

        fetchArtists();
    }, [stageId]);

    return (
        <StageContainer>
            <h2>Ranking for {stageId}</h2>
            <div>
                {artists.map(artist => (
                    <ArtistCard key={artist.id} artist={artist} />
                ))}
            </div>
        </StageContainer>
    );
};

export default Stage;
