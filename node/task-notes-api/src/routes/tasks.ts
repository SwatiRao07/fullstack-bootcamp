import { Router } from 'express';
import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { TaskSchema } from '../models/task.js';
import type { Task } from '../models/task.js';
import { FileStorage } from '../storage.js';
import { TaskEventEmitter } from '../events.js';
import { logger } from '../logger.js';

export function createTaskRouter(storage: FileStorage, emitter: TaskEventEmitter): Router {
  const router = Router();

  // GET /api/tasks - List tasks with pagination
  router.get('/', async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const completed =
        req.query.completed === 'true' ? true : req.query.completed === 'false' ? false : undefined;

      let tasks = await storage.loadNotes();

      if (completed !== undefined) {
        tasks = tasks.filter((t: Task) => t.completed === completed);
      }

      const total = tasks.length;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedTasks = tasks.slice(startIndex, endIndex);

      res.json({
        data: paginatedTasks,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  });

  // POST /api/tasks - Create new task
  router.post('/', async (req: Request, res: Response) => {
    try {
      const result = TaskSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid data', details: result.error.format() });
      }

      const tasks = await storage.loadNotes();
      const newTask: Task = {
        ...result.data,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      tasks.push(newTask);
      await storage.saveNotes(tasks);
      emitter.emitTaskCreated(newTask);

      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create task' });
    }
  });

  // GET /api/tasks/:id - Get specific task
  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const tasks = await storage.loadNotes();
      const task = tasks.find((t: Task) => t.id === req.params.id);

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch task' });
    }
  });

  // PUT /api/tasks/:id - Update task
  router.put('/:id', async (req: Request, res: Response) => {
    try {
      const result = TaskSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid data', details: result.error.format() });
      }

      const tasks = await storage.loadNotes();
      const index = tasks.findIndex((t: Task) => t.id === req.params.id);

      if (index === -1) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const updatedTask = {
        ...tasks[index],
        ...result.data,
        updatedAt: new Date().toISOString(),
      };

      tasks[index] = updatedTask;
      await storage.saveNotes(tasks);
      emitter.emitTaskUpdated(updatedTask);

      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update task' });
    }
  });

  // DELETE /api/tasks/:id - Delete task
  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const tasks = await storage.loadNotes();
      const index = tasks.findIndex((t: Task) => t.id === req.params.id);

      if (index === -1) {
        return res.status(404).json({ error: 'Task not found' });
      }

      tasks.splice(index, 1);
      await storage.saveNotes(tasks);
      if (req.params.id) {
        emitter.emitTaskDeleted(req.params.id as string);
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete task' });
    }
  });

  return router;
}
