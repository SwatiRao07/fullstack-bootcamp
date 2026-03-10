export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  isAvailable: boolean;
  description?: string;
  coverImage?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "user";
}
