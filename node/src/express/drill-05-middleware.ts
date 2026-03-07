import express, { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

const app = express();
const PORT = 3000;

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[Logger] ${req.method} ${req.url}`);
  next();
};

const timer = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[Timer] ${req.method} ${req.url} took ${duration}ms`);
  });
  next();
};

const addRequestId = (req: Request, res: Response, next: NextFunction) => {
  (req as any).requestId = randomUUID();
  next();
};

app.get('/public', logger, timer, (req: Request, res: Response) => {
  res.send('Public route - middleware applied');
});

app.get('/private', addRequestId, (req: Request, res: Response) => {
  res.send(`Private route - requestId: ${(req as any).requestId}`);
});

app.get('/order', logger, addRequestId, timer, (req: Request, res: Response) => {
  console.log('[Handler] inside route handler');
  res.send(`Request ID: ${(req as any).requestId}`);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
