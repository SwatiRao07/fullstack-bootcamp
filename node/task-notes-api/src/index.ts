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

const config = loadConfig();

async function bootstrap() {
  logger.info({ port: config.port, env: config.env }, 'Application starting...');

  // Initialize components
  const storage = new FileStorage(config.dataPath);
  const emitter = new TaskEventEmitter();
  const userDb = new UserDatabase('./data/users.db');
  const authService = new AuthService(userDb, config);
  const healthChecker = new HealthChecker(config.redisUrl);
  const metrics = new MetricsCollector();

  // Initialize Jobs
  const scheduler = new TaskScheduler(config.redisUrl);
  const workers = setupWorkers(config.redisUrl);

  // Initialize Server
  const server = new TaskServer(config, storage, emitter, authService, healthChecker, metrics);

  // Start Server
  await server.start();

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
}

bootstrap().catch((err) => {
  logger.error(err, 'Failed to start application');
  process.exit(1);
});
