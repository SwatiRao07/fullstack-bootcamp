import React, { useState } from "react";
import type { Book } from "../../../types";

interface AddBookFormProps {
  onAddBook: (book: Omit<Book, "id">) => void;
}

export const AddBookForm: React.FC<AddBookFormProps> = ({ onAddBook }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author) return;

    onAddBook({
      title,
      author,
      year,
      isAvailable: true,
      description: "A newly added book.",
    });

    setTitle("");
    setAuthor("");
    setYear(new Date().getFullYear());
  };

  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log("Enter pressed — submitting:", { title, author, year });
    }
  };

  return (
    <form className="add-book-form" onSubmit={handleSubmit}>
      <h3>Add New Book</h3>
      <div className="form-group">
        <label htmlFor="book-title">Title</label>
        <input
          id="book-title"
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)} 
          onKeyDown={handleKeyDown} 
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="book-author">Author</label>
        <input
          id="book-author"
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="book-year">Year</label>
        <input
          id="book-year"
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          required
        />
      </div>
      <button type="submit" className="submit-btn">
        Add Book
      </button>
    </form>
  );
};
