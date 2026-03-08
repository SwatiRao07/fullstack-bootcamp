import { Router } from "express";
import { taskService } from "../services/taskService";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { title, user_id } = req.body;
    const task = await taskService.createTask(title, user_id);
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
    const { completed } = req.body;
    const task = await taskService.updateTaskStatus(id, completed);
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
