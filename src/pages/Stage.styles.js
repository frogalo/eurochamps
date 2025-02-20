import styled from "styled-components";

// Styled container for the stage
export const StageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background-color: #f9f9f9;
    min-height: 100vh; // Ensure it takes full height

    h2 {
        margin-bottom: 1rem;
        color: #333;
    }
`;

// Styled button for adding a new artist
export const AddArtistButton = styled.button`
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    background-color: #28a745; /* Green color for add button */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 1rem; /* Space above the button */
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #218838; /* Darker green on hover */
    }

    &:active {
        background-color: #1e7e34; /* Even darker green on active */
    }
`;
