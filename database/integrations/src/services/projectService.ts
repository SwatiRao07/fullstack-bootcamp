import { withTransaction } from "../db/transaction";

export const projectService = {
  async createProjectWithTasks(projectName: string, taskTitles: string[]) {
    return await withTransaction(async (client) => {
  
      const projectResult = await client.query(
        "INSERT INTO projects (name) VALUES ($1) RETURNING *",
        [projectName],
      );
      const project = projectResult.rows[0];

      const tasks = [];
      for (const title of taskTitles) {
        
        if (!title) throw new Error("Task title cannot be empty");

        const taskResult = await client.query(
          "INSERT INTO tasks (title, project_id) VALUES ($1, $2) RETURNING *",
          [title, project.id],
        );
        tasks.push(taskResult.rows[0]);
      }

      return { project, tasks };
    });
  },
};
