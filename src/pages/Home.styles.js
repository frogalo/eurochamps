import styled from "styled-components";

// Styled container for the ranking screen
export const RankingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
  
    height: 80vh;
    background-color: #f9f9f9;
    padding: 1rem;
`;

// Styled button for stage selection
export const StageButton = styled.button`
    min-width: 300px;
    padding: 1rem 2rem; /* Default padding */
    font-size: 1.2rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 0.5rem 0;
    transition: background-color 0.3s ease;
    width: auto; /* Default width */

    &:hover {
        background-color: #0056b3;
    }

    &:active {
        background-color: #003f8a;
    }

    @media (max-width: 768px) {
        width: 100%; /* Full width on mobile */
        padding: 16px; /* Set padding to 16px */
        font-size: 1rem; /* Optional: Adjust font size for mobile */
    }
`;
