import path from 'path';
import fs from 'fs/promises';
import { logger } from './logger.js';
import { loadConfig } from './config.js';
import { TaskServer } from './server.js';
import { FileStorage } from './storage.js';
import { TaskEventEmitter } from './events.js';
import { UserDatabase } from './database.js';
import { AuthService } from './auth/service.js';
import { HealthChecker } from './monitoring.js';
import { MetricsCollector } from './metrics.js';
import { TaskScheduler } from './jobs/scheduler.js';
import { setupWorkers } from './jobs/worker.js';
import { existsSync } from 'fs';

async function bootstrap() {
  let config;
  try {
    config = loadConfig();
  } catch (error) {
    logger.error({ error }, 'Failed to load configuration');
    process.exit(1);
  }

  logger.info({ port: config.port, env: config.env }, 'Application starting...');

  try {
    // Initialize components
    const storage = new FileStorage(config.dataPath);
    const emitter = new TaskEventEmitter();
    const userDb = new UserDatabase(config.userDbPath);
    const authService = new AuthService(userDb, config);
    const healthChecker = new HealthChecker(config.redisUrl);
    const metrics = new MetricsCollector();

    // Initialize Jobs
    const scheduler = new TaskScheduler(config.redisUrl);
    const workers = setupWorkers(config.redisUrl);

    // Initialize Server
    const server = new TaskServer(config, storage, emitter, authService, healthChecker, metrics, userDb);

    // Start Server
    await server.start();

    // Ensure storage directory exists before watching
    const dataDir = path.dirname(config.dataPath);
    if (!existsSync(dataDir)) {
      await fs.mkdir(dataDir, { recursive: true });
    }

    // Watch for changes in storage
    storage.watchChanges(() => {
      logger.info('Storage changed, event emitted');
    });

    const shutdown = async (signal: string) => {
      logger.info({ signal }, 'Shutting down...');
      await server.stop();
      await scheduler.close();
      await workers.close();
      process.exit(0);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

    logger.info('Application ready');
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error({ 
      error: err.message, 
      stack: err.stack,
      cause: (err as any).cause 
    }, 'Failed to start application');
    process.exit(1);
  }
}

bootstrap().catch((err) => {
  logger.error({ error: err, stack: (err instanceof Error) ? err.stack : undefined }, 'Unhandled bootstrap error');
  process.exit(1);
});
