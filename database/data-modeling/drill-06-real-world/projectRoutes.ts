import { Router } from "express";
import {
  projectService,
  preferenceService,
  commentService,
} from "./projectService";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const projects = await projectService.getAllProjects();
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const project = await projectService.createProject(name, description);
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/full", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const data = await projectService.getProjectFullView(id);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/comments", async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id);
    const { authorId, content } = req.body;
    const comment = await commentService.addComment(taskId, authorId, content);
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
});

router.get("/preferences/:userId", async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const prefs = await preferenceService.getUserPreferences(userId);
    res.json(prefs);
  } catch (err) {
    next(err);
  }
});

router.patch("/preferences/:userId", async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const { settings } = req.body;
    const prefs = await preferenceService.updateUserPreferences(
      userId,
      settings,
    );
    res.json(prefs);
  } catch (err) {
    next(err);
  }
});

export default router;
