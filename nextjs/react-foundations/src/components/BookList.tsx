import BookCard from "./BookCard";
import "./BookList.css";

const books = [
  { title: "To Kill a Mockingbird", author: "Harper Lee" },
  { title: "1984", author: "George Orwell" },
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
  { title: "Pride and Prejudice", author: "Jane Austen" },
  { title: "The Catcher in the Rye", author: "J.D. Salinger" },
];

function BookList() {
  return (
    <div className="book-list-container">
      <header className="list-header">
        <h2 className="list-heading">Curated Library</h2>
        <p className="list-subheading">
          Exploring the foundations of React through components.
        </p>
      </header>
      <div className="book-grid">
        {books.map((book, index) => (
          <BookCard key={index} title={book.title} author={book.author} />
        ))}
      </div>
    </div>
  );
}

export default BookList;
