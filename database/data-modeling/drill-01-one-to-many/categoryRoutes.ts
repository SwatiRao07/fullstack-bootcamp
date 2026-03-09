import { Router } from "express";
import { categoryService } from "./categoryService";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, color } = req.body;
    const category = await categoryService.createCategory(name, color);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
});

router.get("/stats", async (req, res, next) => {
  try {
    const stats = await categoryService.getTasksGroupedByCategory();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

export default router;
