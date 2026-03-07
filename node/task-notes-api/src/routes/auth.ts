import { Router } from 'express';
import type { Request, Response } from 'express';
import { AuthService } from '../auth/service.js';
import { z } from 'zod';

const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export function createAuthRouter(authService: AuthService): Router {
  const router = Router();

  router.post('/register', async (req: Request, res: Response) => {
    try {
      const result = AuthSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid data', details: result.error.format() });
      }

      const user = await authService.register(result.data.email, result.data.password);
      res.status(201).json({ id: user.id, email: user.email, role: user.role });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  router.post('/login', async (req: Request, res: Response) => {
    try {
      const result = AuthSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid data', details: result.error.format() });
      }

      const token = await authService.login(result.data.email, result.data.password);
      res.json({ token });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  });

  return router;
}
