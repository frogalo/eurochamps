import React, { useState } from "react";
import { ModalContainer, ModalContent, ModalButton } from "./NewYearModal.styles"; // Import styles
import { addYear } from "../../api/years"; // Import the addYear function

const NewYearModal = ({ isOpen, onClose, onYearAdded }) => {
    const [newYear, setNewYear] = useState("");

    const handleAddYear = async () => {
        try {
            await addYear(newYear); // Call the API to add the year
            onYearAdded(newYear); // Notify the parent component
            setNewYear(""); // Clear input after adding
            onClose(); // Close the modal
        } catch (error) {
            console.error("Error adding year:", error);
        }
    };

    if (!isOpen) return null; // Don't render if not open

    return (
        <ModalContainer>
            <ModalContent>
                <h2>Dodaj nowy rok</h2>
                <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    placeholder="Wpisz rok"
                />
                <div className="button-container"> {/* Center buttons */}
                    <ModalButton onClick={handleAddYear}>Dodaj</ModalButton>
                    <ModalButton onClick={onClose}>Zamknij</ModalButton>
                </div>
            </ModalContent>
        </ModalContainer>
    );
};

export default NewYearModal;
