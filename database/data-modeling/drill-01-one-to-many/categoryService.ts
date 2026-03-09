import { pool } from "../../setup/src/config/database";

export interface Category {
  id: number;
  name: string;
  color?: string;
}

export const categoryService = {
  async getAllCategories(): Promise<Category[]> {
    const { rows } = await pool.query("SELECT * FROM categories ORDER BY name");
    return rows;
  },

  async createCategory(name: string, color?: string): Promise<Category> {
    const { rows } = await pool.query(
      "INSERT INTO categories (name, color) VALUES ($1, $2) RETURNING *",
      [name, color],
    );
    return rows[0];
  },

  async getTasksGroupedByCategory() {
    const { rows } = await pool.query(`
      SELECT c.name as category_name, COUNT(t.id) as task_count
      FROM categories c
      LEFT JOIN tasks t ON c.id = t.category_id
      GROUP BY c.name
    `);
    return rows;
  },
};
