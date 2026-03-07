import { Worker } from 'bullmq';
import { reminderHandler, cleanupHandler } from './handlers.js';
import { logger } from '../logger.js';

export function setupWorkers(redisUrl: string) {
  const connection = { url: redisUrl };

  const reminderWorker = new Worker('task-reminders', reminderHandler, { connection });
  const cleanupWorker = new Worker('system-cleanup', cleanupHandler, { connection });

  reminderWorker.on('completed', (job) => logger.info({ jobId: job.id }, 'Reminder job completed'));
  reminderWorker.on('failed', (job, err) =>
    logger.error({ jobId: job?.id, err }, 'Reminder job failed')
  );

  cleanupWorker.on('completed', (job) => logger.info({ jobId: job.id }, 'Cleanup job completed'));
  cleanupWorker.on('failed', (job, err) =>
    logger.error({ jobId: job?.id, err }, 'Cleanup job failed')
  );

  logger.info('Background workers started');

  return {
    async close() {
      await reminderWorker.close();
      await cleanupWorker.close();
    },
  };
}
