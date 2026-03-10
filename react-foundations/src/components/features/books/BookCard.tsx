import React, { useState } from "react";

// Drill Set 2: TypeScript interface for prop types
interface BookCardProps {
  id: string;
  title: string;
  author: string;
  year: number;
  isAvailable?: boolean; // optional with default
  coverImage?: string;
  onToggleAvailability: (id: string) => void;
  onViewDetails: (book: {
    id: string;
    title: string;
    author: string;
    year: number;
    isAvailable: boolean;
    coverImage?: string;
  }) => void; // Drill Set 6
}

// Drill Set 2: destructuring props directly in function parameters + default value
export const BookCard: React.FC<BookCardProps> = ({
  id,
  title,
  author,
  year,
  isAvailable = true,
  coverImage,
  onToggleAvailability,
  onViewDetails,
}) => {
  // Drill Set 3: useState to manage availability toggle locally inside BookCard
  const [available, setAvailable] = useState(isAvailable);

  const handleToggle = () => {
    // Drill Set 3: never mutate state directly — use setter with new value
    setAvailable((prev) => !prev);
    onToggleAvailability(id);
  };

  return (
    <div className={`book-card ${!available ? "unavailable" : ""}`}>
      {coverImage && (
        <img src={coverImage} alt={title} className="book-cover" />
      )}
      <div className="book-info">
        <h3>{title}</h3>
        <p className="author">by {author}</p>
        <p className="year">Published: {year}</p>
        <div className="status-container">
          <span className={`badge ${available ? "available" : "borrowed"}`}>
            {available ? "Available" : "Borrowed"}
          </span>
          <button className="toggle-btn" onClick={handleToggle}>
            Mark as {available ? "Borrowed" : "Available"}
          </button>
          {/* Drill Set 6: opens Modal via onViewDetails callback */}
          <button
            className="toggle-btn"
            onClick={() =>
              onViewDetails({
                id,
                title,
                author,
                year,
                isAvailable: available,
                coverImage,
              })
            }
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};
