// Stage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { ArtistCard } from "../elements/ArtistCard";
import {
    StageContainer,
    AddArtistButton,
    RankingNumber,
    DraggableContainer,
    ArtistList
} from "./Stage.styles";
import NewArtistModal from "../elements/modals/NewArtistModal";
import { getArtistsForStage } from "../api/artists";
import { getStageById } from "../api/stages";

const Stage = () => {
    const { stageId } = useParams();
    const [artists, setArtists] = useState([]);
    const [stageName, setStageName] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [draggedItem, setDraggedItem] = useState(null);
    const [touchStartY, setTouchStartY] = useState(null);
    const [currentY, setCurrentY] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragItemRef = useRef(null);
    const listRef = useRef(null);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const data = await getArtistsForStage(stageId);
                setArtists(data);
            } catch (error) {
                console.error("Failed to fetch artists:", error);
            }
        };

        const fetchStageName = async () => {
            try {
                const stageData = await getStageById(stageId);
                setStageName(stageData.name);
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
        const stage = stageOptions.find((option) => option.value === stageId);
        return stage ? stage.label : stageId;
    };

    const handleArtistAdded = async () => {
        try {
            const data = await getArtistsForStage(stageId);
            setArtists(data);
        } catch (error) {
            console.error("Failed to refetch artists:", error);
        }
    };

    // Touch event handlers
    const handleTouchStart = (e, index) => {
        const touch = e.touches[0];
        setTouchStartY(touch.clientY);
        setDraggedItem(index);
        setIsDragging(true);
        dragItemRef.current = e.currentTarget;
        e.currentTarget.style.zIndex = "1000";
    };

    const handleTouchMove = (e) => {
        if (draggedItem === null) return;

        e.preventDefault();
        const touch = e.touches[0];
        setCurrentY(touch.clientY);

        if (dragItemRef.current) {
            const deltaY = touch.clientY - touchStartY;
            dragItemRef.current.style.transform = `translateY(${deltaY}px)`;
        }

        // Find and swap items if necessary
        if (listRef.current) {
            const items = [...listRef.current.children];
            const draggedRect = dragItemRef.current.getBoundingClientRect();
            const draggedMiddle = draggedRect.top + draggedRect.height / 2;

            items.forEach((item, index) => {
                if (index !== draggedItem) {
                    const rect = item.getBoundingClientRect();
                    const middle = rect.top + rect.height / 2;

                    if (draggedMiddle > middle && draggedItem < index) {
                        // Dragging downwards
                        const newArtists = [...artists];
                        const [removed] = newArtists.splice(draggedItem, 1);
                        newArtists.splice(index, 0, removed);
                        setArtists(newArtists);
                        setDraggedItem(index);
                    } else if (draggedMiddle < middle && draggedItem > index) {
                        // Dragging upwards
                        const newArtists = [...artists];
                        const [removed] = newArtists.splice(draggedItem, 1);
                        newArtists.splice(index, 0, removed);
                        setArtists(newArtists);
                        setDraggedItem(index);
                    }
                }
            });
        }
    };

    const handleTouchEnd = () => {
        if (dragItemRef.current) {
            dragItemRef.current.style.transform = "";
            dragItemRef.current.style.zIndex = "";
        }
        setDraggedItem(null);
        setTouchStartY(null);
        setCurrentY(null);
        setIsDragging(false);
    };

    // Desktop drag and drop handlers
    const handleDragStart = (e, index) => {
        setDraggedItem(index);
        setIsDragging(true);
        e.currentTarget.style.opacity = "0.4";
    };

    const handleDragEnd = (e) => {
        e.currentTarget.style.opacity = "1";
        setDraggedItem(null);
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        if (draggedItem === null) return;

        const newArtists = [...artists];
        const [removed] = newArtists.splice(draggedItem, 1);
        newArtists.splice(dropIndex, 0, removed);
        setArtists(newArtists);
    };

    return (
        <StageContainer>
            <h2>{getStageTitle(stageName)}</h2>
            <ArtistList ref={listRef}>
                {artists.map((artist, index) => (
                    <DraggableContainer
                        key={artist._id}
                        draggable="true"
                        isDragging={isDragging && draggedItem === index}
                        isDragTarget={isDragging && draggedItem !== index}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnd={handleDragEnd}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        onTouchStart={(e) => handleTouchStart(e, index)}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <RankingNumber>{index + 1}</RankingNumber>
                        <ArtistCard artist={artist} />
                    </DraggableContainer>
                ))}
            </ArtistList>
            <AddArtistButton onClick={() => setIsModalOpen(true)}>
                Dodaj nowego artystę
            </AddArtistButton>
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
