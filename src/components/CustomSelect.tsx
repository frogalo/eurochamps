"use client";

import React, { useEffect, useRef, useState } from "react";

export interface SelectOption {
  value: string;
  label: string;
  icon?: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  id?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Wybierz...",
  label,
  id,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="field-shell" ref={ref}>
      {label && <span className="field-label">{label}</span>}
      <button
        id={id}
        type="button"
        className={`custom-select-trigger ${open ? "custom-select-open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="custom-select-value">
          {selected?.icon && (
            <img className="custom-select-icon" src={selected.icon} alt="" />
          )}
          {selected ? selected.label : placeholder}
        </span>
        <span className="custom-select-chevron">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <ul className="custom-select-dropdown" role="listbox">
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={`custom-select-option ${opt.value === value ? "custom-select-option-active" : ""}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.icon && (
                <img className="custom-select-icon" src={opt.icon} alt="" />
              )}
              <span>{opt.label}</span>
            </li>
          ))}
          {options.length === 0 && (
            <li className="custom-select-option custom-select-empty">Brak opcji</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
