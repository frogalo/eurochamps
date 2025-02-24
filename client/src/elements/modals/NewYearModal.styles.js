import styled from "styled-components";

export const ModalContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000; // Ensure it appears above other content
`;

export const ModalContent = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 300px; // Set a fixed width for the modal

    h2 {
        margin-bottom: 1rem;
    }

    input {
        width: 80%;
        padding: 0.5rem;
        margin-bottom: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    button {
        padding: 0.5rem 1rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 0.5rem;

        &:hover {
            background-color: #0056b3;
        }
    }
`;

export const ModalButton = styled.button`
    background: none;
    border: none;
    color: #333;
    cursor: pointer;
    font-size: 1rem;

    &:hover {
        text-decoration: underline;
    }
`;
