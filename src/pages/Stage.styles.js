// Stage.styles.js
import styled from "styled-components";

export const StageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    background-color: #f9f9f9;
    min-height: 100vh;

    h2 {
        margin-bottom: 1rem;
        color: #333;
        text-align: center;
    }
`;

export const ArtistList = styled.div`
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
`;

export const DraggableContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 15px;
    margin: 10px 0;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    touch-action: none;
    user-select: none;
    position: relative;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        height: 2px;
        background-color: #9034db;
        opacity: 0;
        transition: opacity 0.2s ease;
    }

    ${({ isDragging }) =>
            isDragging &&
            `
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    background-color: #f8f9fa;
  `}

    ${({ isDragTarget }) =>
            isDragTarget &&
            `
    &:before {
      opacity: 1;
    }
  `}

    @media (hover: hover) {
    cursor: move;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    &:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
}
`;

export const RankingNumber = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    font-weight: bold;
    color: white;
    background-color: #9034db;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    flex-shrink: 0;
    user-select: none;

    @media (min-width: 768px) {
        width: 50px;
        height: 50px;
        font-size: 1.4rem;
    }
`;

export const AddArtistButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #218838;
  }

  &:active {
    background-color: #1e7e34;
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 300px;
  }
`;
