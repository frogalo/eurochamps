import styled from "styled-components";

// Styled container for the artist card
export const CardContainer = styled.div`
    display: flex;
    align-items: center; /* Align items vertically */
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 1rem;
    margin: 0.5rem;
    width: 300px; // Fixed width for cards
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;

    &:hover {
        transform: scale(1.05); // Slightly enlarge on hover
    }

    .flag {
        width: 64px; // Set flag size
        height: auto; // Maintain aspect ratio
        margin-right: 1rem; // Space between flag and text
    }

    .info {
        flex-grow: 1; // Allow info to take remaining space
    }

    h3 {
        margin: 0 0 0.5rem 0;
    }

    p {
        margin: 0.25rem 0;
    }

    a {
        color: #007bff;
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }
`;
