import { Worker } from 'bullmq';
import { reminderHandler, cleanupHandler } from './handlers.js';
import { logger } from '../logger.js';

export function setupWorkers(redisUrl: string) {
  if (!redisUrl) {
    logger.warn('No Redis URL provided. Background workers disabled.');
    return { async close() {} };
  }

  let reminderWorker: Worker | null = null;
  let cleanupWorker: Worker | null = null;

  try {
    const connection = { url: redisUrl };

    reminderWorker = new Worker('task-reminders', reminderHandler, { connection });
    cleanupWorker = new Worker('system-cleanup', cleanupHandler, { connection });

    reminderWorker.on('completed', (job) => logger.info({ jobId: job.id }, 'Reminder job completed'));
    reminderWorker.on('failed', (job, err) =>
      logger.error({ jobId: job?.id, err }, 'Reminder job failed')
    );

    cleanupWorker.on('completed', (job) => logger.info({ jobId: job.id }, 'Cleanup job completed'));
    cleanupWorker.on('failed', (job, err) =>
      logger.error({ jobId: job?.id, err }, 'Cleanup job failed')
    );

    logger.info('Background workers started');
  } catch (err) {
    logger.warn('Background workers could not connect to Redis. Workers disabled.');
  }

  return {
    async close() {
      await reminderWorker?.close();
      await cleanupWorker?.close();
    },
  };
}
