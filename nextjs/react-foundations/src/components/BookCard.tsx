import "./BookCard.css";

interface BookCardProps {
  title: string;
  author: string;
}

function BookCard({ title, author }: BookCardProps) {
  return (
    <div className="book-card">
      <div className="card-glass-effect"></div>
      <h3 className="book-title">{title}</h3>
      <p className="book-author">By {author}</p>
    </div>
  );
}

export default BookCard;
