import { Router } from "express";
import { userService } from "../services/userService";
import { taskService } from "../services/taskService";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await userService.createUser(email);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/tasks", async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const tasks = await taskService.getUserTasks(userId);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

export default router;
