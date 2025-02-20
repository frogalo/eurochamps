import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // For getting route parameters
import { ArtistCard } from "../elements/ArtistCard"; // Import the ArtistCard component
import { StageContainer, AddArtistButton } from "./Stage.styles"; // Import styles for the stage
import NewArtistModal from "../elements/modals/NewArtistModal"; // Import the modal component
import { getArtistsForStage } from "../api/artists"; // Import the API functions
import { getStageById } from "../api/stages"; // Import the API function

const Stage = () => {
    const { stageId } = useParams(); // Get the stage ID from the URL
    const [artists, setArtists] = useState([]); // State to store artists
    const [stageName, setStageName] = useState(""); // State to store stage name
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

    useEffect(() => {
        // Fetch artists for the selected stage
        const fetchArtists = async () => {
            try {
                const data = await getArtistsForStage(stageId); // Use the API function
                setArtists(data); // Set the fetched array directly
            } catch (error) {
                console.error("Failed to fetch artists:", error);
            }
        };

        // Fetch stage name
        const fetchStageName = async () => {
            try {
                const stageData = await getStageById(stageId); // Use the API function
                setStageName(stageData.name); // Set the stage name
            } catch (error) {
                console.error("Failed to fetch stage name:", error);
            }
        };

        fetchArtists();
        fetchStageName();
    }, [stageId]);
    const getStageTitle = (stageId) => {
        const stageOptions = [
            { value: "countryQuali", label: "Kwalifikacje krajowe" },
            { value: "polfinal1", label: "Półfinał 1" },
            { value: "polfinal2", label: "Półfinał 2" },
            { value: "final", label: "Finał" }
        ];
        const stage = stageOptions.find(option => option.value === stageId);
        return stage ? stage.label : stageId;
    };
    const handleArtistAdded = async () => {
        // Reload the artist list after adding a new artist
        await getArtistsForStage();
    };

    return (
        <StageContainer>
            <h2>{getStageTitle(stageName)}</h2> {/* Display stage name */}
            <div>
                {artists.map(artist => (
                    <ArtistCard key={artist._id} artist={artist} />
                ))}
            </div>
            <AddArtistButton onClick={() => setIsModalOpen(true)}>Dodaj nowego artystę</AddArtistButton>
            <NewArtistModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onArtistAdded={handleArtistAdded}
                stageId={stageId}
            />
        </StageContainer>
    );
};

export default Stage;
