"use client";

import React from "react";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  extra?: React.ReactNode;
  className?: string;
  eyebrow?: string;
  variant?: "primary" | "secondary" | "tertiary";
  type?: "button" | "submit";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  extra,
  className = "",
  eyebrow,
  variant = "primary",
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      className={`performance-button performance-button-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {eyebrow && <span className="performance-button-eyebrow">{eyebrow}</span>}
      <span className="performance-button-label">{text}</span>
      {extra && <span className="performance-button-extra">{extra}</span>}
    </button>
  );
};

export default Button;
