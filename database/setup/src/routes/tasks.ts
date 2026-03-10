import { Router } from "express";
import { taskService } from "../services/taskService";
import { query } from "../config/database";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { title, user_id, metadata } = req.body;
    const task = await taskService.createTask(title, user_id, metadata);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const completed =
      req.query.completed === "true"
        ? true
        : req.query.completed === "false"
          ? false
          : undefined;
    const tasks = await taskService.getTasks(completed);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

router.get("/filter", async (req, res, next) => {
  try {
    const { priority } = req.query;
    if (typeof priority !== "string")
      return res.status(400).json({ error: "Priority must be a string" });
    const tasks = await taskService.filterTasksByPriority(priority);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

router.get("/detailed", async (req, res, next) => {
  try {
    const tasks = await taskService.getTasksWithEmployees();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;
    let task;

    if (updates.completed !== undefined) {
      task = await taskService.updateTaskStatus(id, updates.completed);
    } else if (updates.metadata !== undefined) {
      task = await taskService.updateTaskMetadata(id, updates.metadata);
    } else if (updates.project_id !== undefined) {
      const { rows } = await query(
        "UPDATE tasks SET project_id = $2 WHERE id = $1 RETURNING *",
        [id, updates.project_id],
      );
      task = rows[0];
    } else {
      return res
        .status(400)
        .json({ error: "No valid fields provided for update" });
    }

    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await taskService.deleteTask(id);
    if (!deleted) return res.status(404).json({ error: "Task not found" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
