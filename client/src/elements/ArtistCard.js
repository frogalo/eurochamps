import React from "react";
import {
    CardContainer,
    ImageContainer,
    ArtistImage,
    FlagImage,
    InfoContainer,
    ArtistName,
    ArtistInfo,
    ListenLink,
    PlayButton,
} from "./ArtistCard.styles"; // Import styled components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons'; // Import the play icon

export const ArtistCard = ({ artist }) => {
    const countryName = new Intl.DisplayNames(['pl'], { type: 'region' }).of(artist.country);

    return (
        <CardContainer>
            <ImageContainer>
                <ArtistImage
                    src={artist.imageUrl}
                    alt={`${artist.name}`}
                />
                <FlagImage
                    src={`https://flagsapi.com/${artist.country}/flat/64.png`}
                    alt={`${artist.country} flag`}
                />
            </ImageContainer>
            <InfoContainer>
                <ArtistName>{artist.name}</ArtistName>
                <ArtistInfo>Kraj: {countryName}</ArtistInfo>
                <ArtistInfo>Piosenka: {artist.songTitle}</ArtistInfo>
            </InfoContainer>
            <PlayButton href={artist.songUrl} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faPlayCircle} />
            </PlayButton>
        </CardContainer>
    );
};
