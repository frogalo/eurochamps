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
    z-index: 1000;
`;

export const ModalContent = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 400px;
    max-width: 90%;

    h2 {
        margin-bottom: 1rem;
        text-align: center;
    }

    input {
        width: 100%;
        padding: 0.5rem;
        margin-bottom: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .button-container {
        display: flex;
        justify-content: space-between;
    }
`;

export const ModalButton = styled.button`
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #0056b3;
    }

    &:active {
        background-color: #003f8a;
    }
`;
