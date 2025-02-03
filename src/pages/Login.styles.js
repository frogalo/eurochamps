import styled from "styled-components";

// Styled container for the login screen
export const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f9f9f9;
    padding: 1rem; /* Add padding for smaller screens */
`;

// Styled title
export const Title = styled.h2`
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: #333;
    text-align: center; /* Center the title text */

    @media (max-width: 768px) {
        font-size: 1.5rem; /* Reduce font size on smaller screens */
    }

    @media (max-width: 480px) {
        font-size: 1.25rem; /* Further reduce font size for very small screens */
    }
`;

// Styled unordered list for the user options
export const UserList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center; /* Center the list items horizontally */
    gap: 1rem;
    width: 100%; /* Make the list take full width on smaller screens */
    max-width: 400px; /* Limit the width for larger screens */
`;

// Styled list item
export const UserListItem = styled.li`
    margin: 0;
    width: 100%; /* Ensure the list item takes full width */
    display: flex; /* Use flexbox for alignment */
    justify-content: center; /* Center the content horizontally */
`;

// Styled button for user selection
export const UserButton = styled.button`
    padding: 0.75rem 1.5rem;
    font-size: 2rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    width: 100%; /* Make the button take full width */
    max-width: 300px; /* Limit the button width on larger screens */
    margin: 0 auto; /* Center the button horizontally */

    &:hover {
        background-color: #0056b3;
    }

    &:active {
        background-color: #003f8a;
    }

    @media (max-width: 768px) {
        font-size: 1.9rem; /* Adjust font size for smaller screens */
        padding: 0.6rem 1rem; /* Adjust padding for smaller screens */
    }

    @media (max-width: 480px) {
        font-size: 1.8rem; /* Further reduce font size for very small screens */
        padding: 0.5rem 0.8rem; /* Further adjust padding */
    }
`;

// Styled button for adding a new user
export const NewUserButton = styled.button`
    padding: 0.75rem 1.5rem;
    font-size: 1.5rem;
    background-color: #28a745; /* Green color for add button */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-top: 1rem; /* Space above the button */
    width: 100%; /* Make the button take full width */
    max-width: 300px; /* Limit the button width on larger screens */

    &:hover {
        background-color: #218838; /* Darker green on hover */
    }

    &:active {
        background-color: #1e7e34; /* Even darker green on active */
    }
`;
