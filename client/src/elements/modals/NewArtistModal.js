import React, { useState } from "react";
import {
    ModalContainer,
    ModalContent,
    ModalButton,
} from "./NewArtistModal.styles"; // Import styles
import { addArtist } from "../../api/artists"; // Import the addArtist function

const NewArtistModal = ({ isOpen, onClose, onArtistAdded, stageId }) => {
    const [name, setName] = useState("");
    const [country, setCountry] = useState("");
    const [songUrl, setSongUrl] = useState("");
    const [songTitle, setSongTitle] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const handleAddArtist = async () => {
        try {
            await addArtist({
                name,
                country,
                songUrl,
                songTitle,
                stage: stageId,
                imageUrl,
            }); // Call the API to add the artist
            await onArtistAdded(); // Notify the parent component and wait for it to finish
            setName("");
            setCountry("");
            setSongUrl("");
            setSongTitle("");
            setImageUrl("");
            onClose(); // Close the modal
        } catch (error) {
            console.error("Error adding artist:", error);
            // Consider displaying an error message to the user
        }
    };

    if (!isOpen) return null; // Don't render if not open

    return (
        <ModalContainer>
            <ModalContent>
                <h2>Dodaj nowego artystę</h2>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Imię artysty"
                />
                <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Kraj"
                />
                <input
                    type="text"
                    value={songUrl}
                    onChange={(e) => setSongUrl(e.target.value)}
                    placeholder="URL piosenki"
                />
                <input
                    type="text"
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    placeholder="Tytuł piosenki"
                />
                <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="URL obrazu"
                />
                <div className="button-container">
                    {" "}
                    {/* Center buttons */}
                    <ModalButton onClick={handleAddArtist}>Dodaj</ModalButton>
                    <ModalButton onClick={onClose}>Zamknij</ModalButton>
                </div>
            </ModalContent>
        </ModalContainer>
    );
};

export default NewArtistModal;
