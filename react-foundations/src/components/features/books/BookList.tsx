import React from "react";
import type { Book } from "../../../types";
import { BookCard } from "./BookCard";

// Drill Set 2: passing an array as a prop
interface BookListProps {
  books: Book[];
  onToggleAvailability: (id: string) => void;
  onViewDetails: (book: Book) => void; // Drill Set 6: opens Modal
}

export const BookList: React.FC<BookListProps> = ({
  books,
  onToggleAvailability,
  onViewDetails,
}) => {
  if (books.length === 0) {
    return <p className="no-books">No books found matching your search.</p>;
  }

  return (
    <div className="book-grid">
      {books.map((book) => (
        // Drill Set 2: spreading a Book object to pass individual props
        <BookCard
          key={book.id}
          {...book}
          onToggleAvailability={onToggleAvailability}
          onViewDetails={onViewDetails} // Drill Set 6: thread down to card
        />
      ))}
    </div>
  );
};
