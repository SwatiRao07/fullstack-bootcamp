import { query } from "../config/database";
import { User } from "../models/schema";

export const userService = {
  async createUser(email: string): Promise<User> {
    const result = await query(
      "INSERT INTO users (email) VALUES ($1) RETURNING *",
      [email],
    );
    return result.rows[0];
  },

  async getUsers(): Promise<User[]> {
    const result = await query("SELECT * FROM users ORDER BY created_at DESC");
    return result.rows;
  },

  async getUser(id: number): Promise<User | null> {
    const result = await query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0] || null;
  },
};
