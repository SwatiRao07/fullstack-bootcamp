import { z } from 'zod';

export const TaskSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  completed: z.boolean().default(false),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Task = z.infer<typeof TaskSchema>;

export interface TaskFilter {
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  search?: string;
  page: number;
  limit: number;
}
