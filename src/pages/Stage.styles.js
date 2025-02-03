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
