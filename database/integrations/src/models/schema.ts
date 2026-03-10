export interface User {
  id: number;
  email: string;
  created_at: Date;
}

export interface Category {
  id: number;
  name: string;
  created_at: Date;
}

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  user_id?: number | null;
  category_id?: number | null;
  created_at: Date;
}
