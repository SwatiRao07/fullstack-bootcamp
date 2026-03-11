import type { Book } from "../types";

const OPEN_LIBRARY_URL =
  "https://openlibrary.org/search.json?q=classic+fiction&limit=6&fields=key,title,author_name,first_publish_year,cover_i";

export const fetchBooks = async (signal?: AbortSignal): Promise<Book[]> => {
  const response = await fetch(OPEN_LIBRARY_URL, { signal });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch books: ${response.status} ${response.statusText}`,
    );
  }

  const json = await response.json();

  // Map Open Library shape - our Book interface
  return json.docs.map(
    (doc: {
      key: string;
      title: string;
      author_name?: string[];
      first_publish_year?: number;
      cover_i?: number;
    }): Book => ({
      id: doc.key,
      title: doc.title,
      author: doc.author_name?.[0] ?? "Unknown Author",
      year: doc.first_publish_year ?? 0,
      isAvailable: Math.random() > 0.4, // randomise availability for demo
      coverImage: doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : undefined,
    }),
  );
};
