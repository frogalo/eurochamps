import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { useUser } from "../context/UserContext";
import { RankingContainer, StageButton, YearButton, BackButton, NewYearButton, NewStageButton } from "./Home.styles"; // Ensure you have styles for BackButton and NewYearButton
import NewYearModal from "../elements/modals/NewYearModal"; // Import the modal component
import NewStageModal from "../elements/modals/NewStageModal"; // Import the stage modal
import { fetchYears } from "../api/years"; // Import the fetchYears function

const Home = () => {
    const navigate = useNavigate(); // Hook for navigation
    const { user, role } = useUser(); // Access the logged-in user
    const [years, setYears] = useState([]); // State to store years
    const [selectedYear, setSelectedYear] = useState(null); // State to track selected year
    const [isYearModalOpen, setIsYearModalOpen] = useState(false); // State to manage year modal visibility
    const [isStageModalOpen, setIsStageModalOpen] = useState(false); // State to manage stage modal visibility

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

    const handleStageAdded = async () => {
        // Reload the year list after adding a new stage
        try {
            const data = await fetchYears(); // Fetch updated year data
            setYears(data); // Update the years state

            // Find the selected year in the updated data
            const updatedSelectedYear = data.find(year => year._id === selectedYear._id);
            if (updatedSelectedYear) {
                setSelectedYear(updatedSelectedYear); // Update the selected year
            }
        } catch (error) {
            console.error("Failed to fetch years:", error);
        }
    };
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
    return (
        <RankingContainer>
            {!selectedYear ? (
                <>
                    {years.map((year) => (
                        <YearButton key={year._id} onClick={() => handleYearSelect(year)}>
                            {year.year}
                        </YearButton>
                    ))}
                    {user && role && ( // Show button only if user is admin
                        <NewYearButton onClick={() => setIsYearModalOpen(true)}>
                            Dodaj nowy rok
                        </NewYearButton>
                    )}
                </>
            ) : (
                <>
                    <h2>{selectedYear.year}</h2> {/* Display selected year */}
                    {/* Display stages for the selected year */}
                    {selectedYear.stages.map((stage) => (
                        <StageButton key={stage._id} onClick={() => handleStageSelect(stage._id)}>
                            {getStageTitle(stage.name)}
                        </StageButton>
                    ))}
                    {user && role && ( // Show button only if user is admin
                        <NewStageButton onClick={() => setIsStageModalOpen(true)}>
                            Dodaj nowy etap
                        </NewStageButton>
                    )}
                    <BackButton onClick={handleBack}>Wróć do lat</BackButton> {/* Back button */}
                </>
            )}
            <NewYearModal
                isOpen={isYearModalOpen}
                onClose={() => setIsYearModalOpen(false)}
                onYearAdded={handleYearAdded} // Pass the handler to the modal
            />
            <NewStageModal
                isOpen={isStageModalOpen}
                onClose={() => setIsStageModalOpen(false)}
                onStageAdded={handleStageAdded} // Pass the handler to the modal
                yearId={selectedYear?._id} // Pass the selected year ID to the modal
            />
        </RankingContainer>
    );
};

export default Home;
