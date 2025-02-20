import React, { useState } from "react";
import { ModalContainer, ModalContent, ModalButton } from "./NewStageModal.styles"; // Import styles
import { addStage } from "../../api/stages"; // Import the addStage function

const NewStageModal = ({ isOpen, onClose, onStageAdded, yearId }) => {
    const [stageName, setStageName] = useState("");

    const handleAddStage = async () => {
        try {
            await addStage({ name: stageName, year: yearId }); // Call the API to add the stage
            onStageAdded(); // Notify the parent component
            setStageName(""); // Clear input after adding
            onClose(); // Close the modal
        } catch (error) {
            console.error("Error adding stage:", error);
        }
    };

    if (!isOpen) return null; // Don't render if not open

    return (
        <ModalContainer>
            <ModalContent>
                <h2>Dodaj nowy etap</h2>
                <select
                    value={stageName}
                    onChange={(e) => setStageName(e.target.value)}
                >
                    <option value="">Wybierz etap</option>
                    <option value="countryQuali">Kwalifikacje krajowe</option>
                    <option value="polfinal1">Półfinał 1</option>
                    <option value="polfinal2">Półfinał 2</option>
                    <option value="final">Finał</option>
                </select>
                <div className="button-container"> {/* Center buttons */}
                    <ModalButton onClick={onClose}>Zamknij</ModalButton>
                    <ModalButton onClick={handleAddStage}>Dodaj</ModalButton>
                </div>
            </ModalContent>
        </ModalContainer>
    );
};

export default NewStageModal;
