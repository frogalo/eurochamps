import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { useUser } from "../context/UserContext";
import { RankingContainer, StageButton, YearButton, BackButton } from "./Home.styles"; // Ensure you have styles for BackButton

const Home = () => {
    const navigate = useNavigate(); // Hook for navigation
    const [years, setYears] = useState([]); // State to store years
    const [selectedYear, setSelectedYear] = useState(null); // State to track selected year

    useEffect(() => {
        // Fetch years from years.json located in the /data directory
        const fetchYears = async () => {
            try {
                const response = await fetch("/data/years.json"); // Update the path here
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                console.log("Fetched data:", data); // Log the fetched data
                setYears(data.years); // Set the fetched array directly
            } catch (error) {
                console.error("Failed to fetch years:", error);
            }
        };
        fetchYears();
    }, []); // Empty dependency array means this runs once on mount

    const handleYearSelect = (year) => {
        setSelectedYear(year); // Set the selected year
    };

    const handleStageSelect = (stage) => {
        // Navigate to the selected stage
        navigate(`/stages/${stage}`);
    };

    const handleBack = () => {
        setSelectedYear(null); // Reset selected year to go back to years
    };

    return (
        <RankingContainer>
            {!selectedYear ? (
                // Display years if no year is selected
                years.map((year) => (
                    <YearButton key={year.year} onClick={() => handleYearSelect(year)}>
                        {year.year}
                    </YearButton>
                ))
            ) : (
                <>
                    {/* Display stages for the selected year */}
                    {selectedYear.stages.map((stage) => (
                        <StageButton key={stage.id} onClick={() => handleStageSelect(stage.id)}>
                            {stage.title}
                        </StageButton>
                    ))}
                    <BackButton onClick={handleBack}>Wróć do lat</BackButton> {/* Back button */}
                </>
            )}
        </RankingContainer>
    );
};

export default Home;
