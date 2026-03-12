import { Router } from 'express';
import type { Response } from 'express';
import { AuthRequest } from '../auth/middleware.js';
import { UserDatabase } from '../database.js';
import { z } from 'zod';

const UpdateProfileSchema = z.object({
  email: z.string().email().optional(),
});

export function createUserRouter(userDb: UserDatabase): Router {
  const router = Router();

  // GET /api/users/profile - Get current user profile
  router.get('/profile', async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = userDb.getUserById(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.created_at,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  });

  // PUT /api/users/profile - Update current user profile
  router.put('/profile', async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const result = UpdateProfileSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid data', details: result.error.format() });
      }

      const updatedUser = userDb.updateUser(req.user.userId, result.data);
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        createdAt: updatedUser.created_at,
      });
    } catch (error: any) {
      if (error.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  return router;
}
