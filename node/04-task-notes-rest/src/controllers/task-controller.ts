import { Request, Response, NextFunction } from "express";
import { taskService } from "../services/task-service.js";
import {
  CreateTaskSchema,
  UpdateTaskSchema,
  TaskFilterSchema,
} from "../models/task.js";
import { Counter, Histogram } from "prom-client";

// Simple metrics for tasks
const taskCounter = new Counter({
  name: "http_tasks_total",
  help: "Total number of HTTP task requests",
  labelNames: ["method", "status"],
});

const taskResponseHistogram = new Histogram({
  name: "http_task_response_duration_seconds",
  help: "Histogram of task response durations",
  labelNames: ["method", "status"],
});

export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const timer = taskResponseHistogram.startTimer();
  try {
    const filter = TaskFilterSchema.parse(req.query);
    const { data, total } = await taskService.getAll(filter);

    taskCounter.inc({ method: "GET", status: "200" });
    timer({ method: "GET", status: "200" });

    res.status(200).json({
      data,
      metadata: {
        total,
        limit: filter.limit,
        offset: filter.offset,
        count: data.length,
      },
    });
  } catch (err) {
    taskCounter.inc({ method: "GET", status: "500" });
    timer({ method: "GET", status: "500" });
    next(err);
  }
};

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const timer = taskResponseHistogram.startTimer();
  try {
    const body = CreateTaskSchema.parse(req.body);
    const task = await taskService.create(body);

    taskCounter.inc({ method: "POST", status: "201" });
    timer({ method: "POST", status: "201" });

    res.status(201).json(task);
  } catch (err) {
    taskCounter.inc({ method: "POST", status: "400" });
    timer({ method: "POST", status: "400" });
    next(err);
  }
};

export const getTaskById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const timer = taskResponseHistogram.startTimer();
  try {
    const id = String(req.params.id);
    const task = await taskService.getById(id);

    if (!task) {
      taskCounter.inc({ method: "GET", status: "404" });
      timer({ method: "GET", status: "404" });
      return res.status(404).json({
        type: "https://api.task-notes.com/errors/not-found",
        title: "Task Not Found",
        status: 404,
        detail: `Task with ID ${id} was not found.`,
        instance: req.id,
      });
    }

    taskCounter.inc({ method: "GET", status: "200" });
    timer({ method: "GET", status: "200" });
    res.status(200).json(task);
  } catch (err) {
    taskCounter.inc({ method: "GET", status: "500" });
    timer({ method: "GET", status: "500" });
    next(err);
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const timer = taskResponseHistogram.startTimer();
  try {
    const id = String(req.params.id);
    const body = UpdateTaskSchema.parse(req.body);
    const task = await taskService.update(id, body);

    if (!task) {
      taskCounter.inc({ method: "PATCH", status: "404" });
      timer({ method: "PATCH", status: "404" });
      return res.status(404).json({
        type: "https://api.task-notes.com/errors/not-found",
        title: "Task Not Found",
        status: 404,
        detail: `Task with ID ${id} was not found.`,
        instance: req.id,
      });
    }

    taskCounter.inc({ method: "PATCH", status: "200" });
    timer({ method: "PATCH", status: "200" });
    res.status(200).json(task);
  } catch (err) {
    taskCounter.inc({ method: "PATCH", status: "400" });
    timer({ method: "PATCH", status: "400" });
    next(err);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const timer = taskResponseHistogram.startTimer();
  try {
    const id = String(req.params.id);
    const deleted = await taskService.delete(id);

    if (!deleted) {
      taskCounter.inc({ method: "DELETE", status: "404" });
      timer({ method: "DELETE", status: "404" });
      return res.status(404).json({
        type: "https://api.task-notes.com/errors/not-found",
        title: "Task Not Found",
        status: 404,
        detail: `Task with ID ${id} was not found.`,
        instance: req.id,
      });
    }

    taskCounter.inc({ method: "DELETE", status: "204" });
    timer({ method: "DELETE", status: "204" });
    res.status(204).send();
  } catch (err) {
    taskCounter.inc({ method: "DELETE", status: "500" });
    timer({ method: "DELETE", status: "500" });
    next(err);
  }
};
