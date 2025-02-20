import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { useUser } from "../context/UserContext";
import { RankingContainer, StageButton, YearButton, BackButton, NewYearButton } from "./Home.styles"; // Ensure you have styles for BackButton and NewYearButton
import NewYearModal from "../elements/modals/NewYearModal"; // Import the modal component
import { fetchYears } from "../api/years"; // Import the fetchYears function

const Home = () => {
    const navigate = useNavigate(); // Hook for navigation
    const { user, role } = useUser(); // Access the logged-in user
    const [years, setYears] = useState([]); // State to store years
    const [selectedYear, setSelectedYear] = useState(null); // State to track selected year
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

    useEffect(() => {
        // Fetch years from the API
        const loadYears = async () => {
            try {
                const data = await fetchYears(); // Use the fetchYears function
                setYears(data); // Set the fetched array directly
            } catch (error) {
                console.error("Failed to fetch years:", error);
            }
        };

        loadYears();
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

    const handleYearAdded = (newYear) => {
        // Reload the year list after adding a new year
        fetchYears().then(data => setYears(data));
    };

    return (
        <RankingContainer>
            {!selectedYear ? (
                <>
                    {years.map((year) => (
                        <YearButton key={year.year} onClick={() => handleYearSelect(year)}>
                            {year.year}
                        </YearButton>
                    ))}
                    {user && role && ( // Show button only if user is admin
                        <NewYearButton onClick={() => setIsModalOpen(true)}>
                            Dodaj nowy rok
                        </NewYearButton>
                    )}
                </>
            ) : (
                <>
                    <h2>{selectedYear.year}</h2> {/* Display selected year */}
                    {/* Display stages for the selected year */}
                    {selectedYear.stages.map((stage) => (
                        <StageButton key={stage.id} onClick={() => handleStageSelect(stage.id)}>
                            {stage.title}
                        </StageButton>
                    ))}
                    <BackButton onClick={handleBack}>Wróć do lat</BackButton> {/* Back button */}
                </>
            )}
            <NewYearModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onYearAdded={handleYearAdded} // Pass the handler to the modal
            />
        </RankingContainer>
    );
};

export default Home;
