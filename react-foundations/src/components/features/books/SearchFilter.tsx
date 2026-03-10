import React from "react";

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  // Drill Set 4: keyboard event handler — clear search on Escape
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      onSearchChange("");
    }
  };

  return (
    <div className="search-filter">
      <input
        type="text"
        placeholder="Search books…"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)} // Drill Set 4: onChange
        onKeyDown={handleKeyDown} // Drill Set 4: onKeyDown
        className="search-input"
      />
    </div>
  );
};
