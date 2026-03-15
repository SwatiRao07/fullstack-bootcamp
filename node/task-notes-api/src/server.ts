import express from 'express';
import cors from 'cors';
import type { Express } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { Server } from 'http';
import type { AppConfig } from './config.js';
import { logger } from './logger.js';
import { FileStorage } from './storage.js';
import { TaskEventEmitter } from './events.js';
import { createTaskRouter } from './routes/tasks.js';
import { createAuthRouter } from './routes/auth.js';
import { createAuthMiddleware } from './auth/middleware.js';
import { AuthService } from './auth/service.js';
import { HealthChecker } from './monitoring.js';
import { MetricsCollector } from './metrics.js';
import { UserDatabase } from './database.js';
import { createUserRouter } from './routes/users.js';

export class TaskServer {
  private app: Express;
  private server?: Server;

  constructor(
    private config: AppConfig,
    private storage: FileStorage,
    private emitter: TaskEventEmitter,
    private authService: AuthService,
    private healthChecker: HealthChecker,
    private metrics: MetricsCollector,
    private userDb: UserDatabase
  ) {
    this.app = express();
    this.setupApp();
  }

  private setupApp(): void {
    this.app.use(express.json());

    this.app.use(cors({
      origin: this.config.corsOrigin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
    }));

    // Request logging and metrics
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        this.metrics.recordRequest(req.method, req.path, duration);
        logger.info(
          {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
          },
          'HTTP Request'
        );
      });
      next();
    });

    // Public routes
    this.app.get('/health', async (req: Request, res: Response) => {
      const health = await this.healthChecker.checkHealth();
      res.status(health.status === 'healthy' ? 200 : 503).json(health);
    });

    this.app.get('/metrics', (req: Request, res: Response) => {
      res.json(this.metrics.getMetrics());
    });

    this.app.use('/api/auth', createAuthRouter(this.authService));

    // Protected routes
    const authMiddleware = createAuthMiddleware(this.authService);
    this.app.use('/api/tasks', authMiddleware, createTaskRouter(this.storage, this.emitter));
    this.app.use('/api/users', authMiddleware, createUserRouter(this.userDb));

    // Error handling
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      this.metrics.recordError(err);
      logger.error(err, 'Unhandled error');
      res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });
    });
  }

  async start(): Promise<void> {
    return new Promise((resolve) => {
      this.server = this.app.listen(this.config.port, () => {
        logger.info(`Server listening on port ${this.config.port}`);
        resolve();
      });
    });
  }

  async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.server) {
        this.server.close((err) => {
          if (err) return reject(err);
          logger.info('Server stopped');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  getApp(): Express {
    return this.app;
  }
}
