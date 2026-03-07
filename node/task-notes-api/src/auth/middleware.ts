import type { Request, Response, NextFunction } from 'express';
import { AuthService } from './service.js';

export interface AuthRequest extends Request {
  user?: any;
}

export function createAuthMiddleware(authService: AuthService) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Missing token' });
    }
    try {
      const payload = authService.verifyToken(token);
      req.user = payload;
      next();
    } catch (error: any) {
      res.status(401).json({ error: 'Unauthorized', message: error.message });
    }
  };
}
