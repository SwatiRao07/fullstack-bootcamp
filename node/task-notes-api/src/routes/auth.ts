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
      
      // Auto-login after registration
      const token = await authService.login(result.data.email, result.data.password);
      const payload = authService.verifyToken(token);
      
      res.status(201).json({ token, user: { id: payload.userId, email: payload.email } });
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
      const payload = authService.verifyToken(token);
      res.json({ token, user: { id: payload.userId, email: payload.email } });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  });

  router.post('/logout', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(400).json({ error: 'Missing token' });
      }
      const parts = authHeader.split(' ');
      const token = parts[1];
      if (!token) {
        return res.status(400).json({ error: 'Missing token' });
      }
      await authService.logout(token);
      res.json({ message: 'Logged out successfully' });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to logout' });
    }
  });

  return router;
}
