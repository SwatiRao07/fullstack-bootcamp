import { useState, useEffect, useMemo } from "react";
import { Layout } from "./components/layout/Layout";
import { BookList } from "./components/features/books/BookList";
import { AddBookForm } from "./components/features/books/AddBookForm";
import { SearchFilter } from "./components/features/books/SearchFilter";
import { UserProfile } from "./components/features/users/UserProfile";
import { Counter } from "./components/common/Counter";
import { LoadingSpinner } from "./components/common/LoadingSpinner";
import { Modal } from "./components/common/Modal"; // Drill Set 6: Modal pattern
import { fetchBooks } from "./api/books";
import type { Book, User } from "./types";
import "./App.css";

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Drill Set 5: error state
  const [searchTerm, setSearchTerm] = useState("");
  // Drill Set 6: Modal state — shows/hides based on useState
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const currentUser: User = {
    id: "u1",
    name: "Swati Rao",
    email: "swati@example.com",
    role: "admin",
  };

  useEffect(() => {
    // Drill Set 5: AbortController for effect cleanup
    const controller = new AbortController();

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Drill Set 5: fetch from REST API, pass signal for cleanup
        const data = await fetchBooks(controller.signal);
        setBooks(data);
      } catch (err) {
        // Drill Set 5: error handling — ignore AbortError on unmount
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadData(); // Drill Set 5: run once on mount (empty dependency array [])

    // Drill Set 5: cleanup — cancel in-flight request when component unmounts
    return () => controller.abort();
  }, []); // Drill Set 5: [] = run once on mount

  const filteredBooks = useMemo(() => {
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [books, searchTerm]);

  const handleToggleAvailability = (id: string) => {
    // Drill Set 3: spread operator to update object inside array — never mutate
    setBooks((prev) =>
      prev.map((book) =>
        book.id === id ? { ...book, isAvailable: !book.isAvailable } : book,
      ),
    );
  };

  const handleAddBook = (newBook: Omit<Book, "id">) => {
    // Drill Set 3: spread object to build a new book, spread array to prepend
    const bookWithId = {
      ...newBook,
      id: Math.random().toString(36).substr(2, 9),
    };
    // Drill Set 3: setState([...oldArray, newItem]) — never push directly
    setBooks((prev) => [bookWithId, ...prev]);
  };

  const availableCount = books.filter((b) => b.isAvailable).length;

  return (
    <Layout>
      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <UserProfile user={currentUser} />
          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-number">{books.length}</span>
              <span className="stat-label">Total Books</span>
            </div>
            <div className="stat-card">
              <span className="stat-number available-num">
                {availableCount}
              </span>
              <span className="stat-label">Available</span>
            </div>
          </div>
          <Counter />
          <div className="sidebar-divider" />
          <AddBookForm onAddBook={handleAddBook} />
        </aside>

        {/* Main content */}
        <main className="library-main">
          <div className="library-toolbar">
            <div>
              <h2 className="library-heading">Your Library</h2>
              <p className="library-subheading">
                {filteredBooks.length} of {books.length} books
              </p>
            </div>
            <SearchFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>

          {/* Drill Set 5: handle loading, error, and data states */}
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="error-boundary">
              <h2>Failed to load books</h2>
              <p
                style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}
              >
                {error}
              </p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : (
            <BookList
              books={filteredBooks}
              onToggleAvailability={handleToggleAvailability}
              onViewDetails={setSelectedBook} // Drill Set 6: open modal
            />
          )}
        </main>
      </div>

      {/* Drill Set 6: Modal shows/hides based on selectedBook state */}
      <Modal
        isOpen={selectedBook !== null}
        onClose={() => setSelectedBook(null)}
        title={selectedBook?.title ?? ""}
      >
        {selectedBook && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {selectedBook.coverImage && (
              <img
                src={selectedBook.coverImage}
                alt={selectedBook.title}
                style={{
                  width: "100%",
                  maxHeight: 200,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            )}
            <p>
              <strong>Author:</strong> {selectedBook.author}
            </p>
            <p>
              <strong>Year:</strong> {selectedBook.year}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color: selectedBook.isAvailable
                    ? "var(--success)"
                    : "var(--danger)",
                }}
              >
                {selectedBook.isAvailable ? "Available" : "Borrowed"}
              </span>
            </p>
          </div>
        )}
      </Modal>
    </Layout>
  );
}

export default App;
