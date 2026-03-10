import { query } from "../config/database";
import { User } from "../models/schema";
import { BaseRepository } from "./BaseRepository";

export class UserRepository extends BaseRepository<User> {
  protected tableName = "users";

  async findByEmail(email: string): Promise<User | null> {
    const result = await query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0] || null;
  }

  async create(email: string): Promise<User> {
    const result = await query(
      "INSERT INTO users (email) VALUES ($1) RETURNING *",
      [email],
    );
    return result.rows[0];
  }
}
