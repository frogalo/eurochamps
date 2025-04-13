"use client";

import React from "react";

interface ButtonProps {
    text: string;
    onClick: () => void;
    extra?: React.ReactNode;
    className?: string;
    children?: React.ReactNode;
    background?: string;
}

const Button: React.FC<ButtonProps> = ({
                                           text,
                                           onClick,
                                           extra,
                                           className = "",
                                           background,
                                       }) => {
    return (
        <button
            style={background ? { backgroundColor: background } : {}}
            className={`custom-button ${className}`}
            onClick={onClick}
        >
            <span>{text}</span>
            {extra && <div className="extra">{extra}</div>}
        </button>
    );
};

export default Button;
