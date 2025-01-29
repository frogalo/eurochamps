import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { useUser } from "../context/UserContext";
import { RankingContainer, StageButton } from "./Home.styles";

const Home = () => {
    const { user } = useUser(); // Access the logged-in user
    const navigate = useNavigate(); // Hook for navigation
    const [stages, setStages] = useState([]); // State to store stages

    useEffect(() => {
        // Fetch stages from stages.json located in the /data directory
        const fetchStages = async () => {
            try {
                const response = await fetch("/data/stages.json"); // Update the path here
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                console.log("Fetched data:", data); // Log the fetched data
                setStages(data); // Set the fetched array directly
            } catch (error) {
                console.error("Failed to fetch stages:", error);
            }
        };

        fetchStages();
    }, []);

    const handleStageSelect = (stage) => {
        // Navigate to the selected stage
        navigate(`/stages/${stage}`);
    };

    return (
        <RankingContainer>
            {stages.map((stage) => (
                <StageButton key={stage.id} onClick={() => handleStageSelect(stage.id)}>
                    {stage.title}
                </StageButton>
            ))}
        </RankingContainer>
    );
};

export default Home;
