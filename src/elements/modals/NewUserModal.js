import React, { useState } from "react";
import { ModalContainer, ModalContent, ModalButton } from "./NewUserModal.styles"; // Import styles
import { addUser } from "../../api/users"; // Import the addUser function

const NewUserModal = ({ isOpen, onClose, onUserAdded }) => {
    const [newUserName, setNewUserName] = useState("");

    const handleAddUser = async () => {
        try {
            onUserAdded(newUserName); // Notify the parent component
            setNewUserName(""); // Clear input after adding
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    if (!isOpen) return null; // Don't render if not open

    return (
        <ModalContainer>
            <ModalContent>
                <h2>Dodaj nowego użytkownika</h2>
                <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Wpisz imię"
                />
                <div className="button-container"> {/* Center buttons */}
                    <ModalButton onClick={handleAddUser}>Dodaj</ModalButton>
                    <ModalButton onClick={onClose}>Zamknij</ModalButton>
                </div>
            </ModalContent>
        </ModalContainer>
    );
};

export default NewUserModal;
