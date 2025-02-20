import styled from "styled-components";

// Styled container for the ranking screen
export const RankingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 120px;
    height: 100vh;
    background-color: #f9f9f9;
    padding: 1rem;
`;

// Styled button for year selection
export const YearButton = styled.button`
    padding: 1rem 2rem;
    font-size: 1.2rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 0.5rem 0;
    transition: background-color 0.3s ease;
    width: 80%;

    &:hover {
        background-color: #0056b3;
    }

    &:active {
        background-color: #003f8a;
    }
`;

// Styled button for stage selection
export const StageButton = styled.button`
    padding: 1rem 2rem;
    font-size: 1.2rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 0.5rem 0;
    transition: background-color 0.3s ease;
    width: 80%;
    
    &:hover {
        background-color: #0056b3;
    }

    &:active {
        background-color: #003f8a;
    }
`;

// Styled button for adding a new year
export const NewYearButton = styled.button`
    padding: 0.75rem 1.5rem;
    font-size: 1.5rem;
    background-color: #28a745; /* Green color for add button */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 1rem; /* Space above the button */
    width: 80%;
    
    &:hover {
        background-color: #218838; /* Darker green on hover */
    }

    &:active {
        background-color: #1e7e34; /* Even darker green on active */
    }
`;

// Styled button for going back to years
export const BackButton = styled.button`
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    background-color: #ff4d4d; /* Red color for back button */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 1rem; /* Space below the button */
    transition: background-color 0.3s ease;
    width: 80%;
    
    &:hover {
        background-color: #e60000; /* Darker red on hover */
    }

    &:active {
        background-color: #cc0000; /* Even darker red on active */
    }
`;
