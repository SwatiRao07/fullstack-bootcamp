import React from "react";

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  
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
        onChange={(e) => onSearchChange(e.target.value)} 
        onKeyDown={handleKeyDown} 
        className="search-input"
      />
    </div>
  );
};
