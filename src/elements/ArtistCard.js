import React from "react";
import { CardContainer } from "./ArtistCard.styles"; // Import styles for the card

export const ArtistCard = ({ artist }) => {
    return (
        <CardContainer>
            <img
                src={`https://flagsapi.com/${artist.countryCode}/flat/64.png`}
                alt={`${artist.country} flag`}
                className="flag"
            />
            <div className="info">
                <h3>{artist.name}</h3>
                <p>Country: {artist.country}</p>
                <p>Song: {artist.songTitle}</p>
                <a href={artist.songUrl} target="_blank" rel="noopener noreferrer">Listen</a>
            </div>
        </CardContainer>
    );
};
