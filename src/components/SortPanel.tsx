import React from "react";

export type SortOption = {
  label: string;
  value: string;
};

export interface SortPanelProps {
  options: SortOption[];
  selected: string;
  onSelect: (value: string) => void;
}

export default function SortPanel({ options, selected, onSelect }: SortPanelProps) {
  return (
    <div className="flex bg-white rounded-lg shadow-sm overflow-hidden w-fit">
      {options.map((option, index) => (
        <button
          key={option.value}
          className={`
            w-30 py-2 px-3 text-center text-sm font-medium
            ${
              selected === option.value
                ? "bg-orange-500 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }
            ${index > 0 && selected !== option.value && selected !== options[index - 1].value ? "border-l border-gray-200" : ""}
            focus:outline-none transition-colors duration-200
          `}
          onClick={() => onSelect(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
