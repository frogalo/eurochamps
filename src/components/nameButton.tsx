"use client";

import React from "react";

interface NameButtonProps {
    name: string;
    onClick: () => void;
}

const NameButton: React.FC<NameButtonProps> = ({ name, onClick }) => {
    return (
        <button className="name-button" onClick={onClick}>
            {name}
        </button>
    );
};

export default NameButton;
