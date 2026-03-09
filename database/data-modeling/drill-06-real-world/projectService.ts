import { query } from "../../setup/src/config/database";

export const projectService = {
  async getAllProjects() {
    const { rows } = await query("SELECT * FROM projects");
    return rows;
  },

  async createProject(name: string, description?: string) {
    const { rows } = await query(
      "INSERT INTO projects (name, description) VALUES ($1, $2) RETURNING *",
      [name, description],
    );
    return rows[0];
  },

  async getProjectFullView(projectId: number) {
    const sql = `
      SELECT 
          p.name as project_name, 
          t.id as task_id,
          t.title as task_title, 
          COUNT(c.id) as comment_count
      FROM projects p
      LEFT JOIN tasks t ON p.id = t.project_id
      LEFT JOIN comments c ON t.id = c.task_id
      WHERE p.id = $1
      GROUP BY p.id, t.id;
    `;
    const { rows } = await query(sql, [projectId]);
    return rows;
  },
};

export const commentService = {
  async addComment(taskId: number, authorId: number, content: string) {
    const { rows } = await query(
      "INSERT INTO comments (task_id, author_id, content) VALUES ($1, $2, $3) RETURNING *",
      [taskId, authorId, content],
    );
    return rows[0];
  },
};

export const preferenceService = {
  async getUserPreferences(userId: number) {
    const { rows } = await query(
      "SELECT * FROM user_preferences WHERE user_id = $1",
      [userId],
    );
    return rows[0] || { user_id: userId, settings: {} };
  },

  async updateUserPreferences(userId: number, settings: any) {
    const { rows } = await query(
      "INSERT INTO user_preferences (user_id, settings) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET settings = user_preferences.settings || $2 RETURNING *",
      [userId, JSON.stringify(settings)],
    );
    return rows[0];
  },
};
