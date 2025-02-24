import styled from "styled-components";

export const HeaderContainer = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #282c34;
    color: white;
`;

export const Title = styled.h1`
    font-size: 1.5rem;
    margin: 0;
`;

export const NameDiv = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem; /* Space between name and icon */
`;

export const LogoutButton = styled.button`
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 1.2rem; /* Adjust size for the icon */

    &:hover {
        color: #61dafb; /* Change color on hover */
    }
`;
