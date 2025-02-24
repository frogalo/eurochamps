import styled from "styled-components";

// Styled container for the modal overlay
export const ModalContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000; /* Ensure it appears above other content */
`;

// Styled content for the modal
export const ModalContent = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 400px; /* Set a fixed width for the modal */
    max-width: 90%; /* Ensure it doesn't exceed the screen width */

    h2 {
        margin-bottom: 1rem;
        text-align: center; /* Center the title */
        color: #333;
    }

    select {
        width: 100%; /* Full width dropdown */
        padding: 0.5rem;
        margin-bottom: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1rem;
        background-color: #f9f9f9;

        &:focus {
            outline: none;
            border-color: #007bff; /* Highlight border on focus */
        }
    }

    .button-container {
        display: flex;
        justify-content: space-between; /* Space between buttons */
        gap: 1rem; /* Add spacing between buttons */
    }
`;

// Styled button for modal actions
export const ModalButton = styled.button`
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    background-color: #007bff; /* Blue color for primary button */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #0056b3; /* Darker blue on hover */
    }

    &:active {
        background-color: #003f8a; /* Even darker blue on active */
    }

    &:last-child {
        background-color: #ff4d4d; /* Red color for cancel button */
    }

    &:last-child:hover {
        background-color: #e60000; /* Darker red on hover */
    }

    &:last-child:active {
        background-color: #cc0000; /* Even darker red on active */
    }
`;
