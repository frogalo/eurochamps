import styled from "styled-components";

// Styled container for the artist card
export const CardContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #e3e3e3;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 1rem;
    margin: 0.5rem;
    width: 400px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    position: relative; /* Add relative positioning */

    &:hover {
        transform: scale(1.05);
    }
`;

// Styled container for the image
export const ImageContainer = styled.div`
    position: relative; /* Make this a positioning context */
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 1rem; /* Space between image and info */
`;

// Styled artist image
export const ArtistImage = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 0.5rem;
`;

// Styled flag image
export const FlagImage = styled.img`
    position: absolute; /* Position the flag absolutely */
    bottom: 0; /* Align to the bottom */
    right: 0; /* Align to the right */
    width: 48px; /* Adjust flag size */
    height: auto;
    border-radius: 50%;
    border: 2px solid #ffffff;
    background-color: #ffffff;
`;

// Styled container for the artist info
export const InfoContainer = styled.div`
    text-align: left;
    flex-grow: 1; /* Allow info to take remaining space */
`;

// Styled heading for the artist name
export const ArtistName = styled.h3`
    margin: 0.5rem 0;
`;

// Styled paragraph for the country and song
export const ArtistInfo = styled.p`
    margin: 0.25rem 0;
`;

// Styled link for listening to the song
export const ListenLink = styled.a`
    color: #007bff;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

// Styled button for playing the song
export const PlayButton = styled.a`
    position: absolute; /* Position the play button absolutely */
    top: 0.7rem; /* Align to the top */
    right: 0.7rem; /* Align to the right */
    background: none;
    border: none;
    color: #FF0000;
    cursor: pointer;
    font-size: 1.5rem; /* Adjust size for the icon */
    transition: color 0.3s ease;

    &:hover {
        color: #0056b3; /* Darker blue on hover */
    }
`;
