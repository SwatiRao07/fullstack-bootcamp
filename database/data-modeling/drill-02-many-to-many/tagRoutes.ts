import { Router } from "express";
import { tagService } from "./tagService";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const tags = await tagService.getAllTags();
    res.json(tags);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name } = req.body;
    const tag = await tagService.addTag(name);
    res.status(201).json(tag);
  } catch (err) {
    next(err);
  }
});

router.post("/assign", async (req, res, next) => {
  try {
    const { taskId, tagIds } = req.body;
    await tagService.assignTagsToTask(taskId, tagIds);
    res.status(200).json({ message: "Tags assigned successfully" });
  } catch (err) {
    next(err);
  }
});

router.get("/tasks-with-tags", async (req, res, next) => {
  try {
    const stats = await tagService.getTasksWithTags();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

export default router;
