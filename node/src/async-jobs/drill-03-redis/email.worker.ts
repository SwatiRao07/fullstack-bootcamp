import { Worker, Job } from 'bullmq';
import { redisOptions } from './email.queue.js';
import { logger } from '../../integrations/utils/logger.js';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const emailWorker = new Worker(
  'send-email',
  async (job: Job) => {
    const startTime = new Date();
    logger.info(
      {
        jobId: job.id,
        to: job.data.to,
        timestamp: startTime,
        attempts: job.attemptsMade + 1,
        maxAttempts: job.opts.attempts,
      },
      'Processing email job (BullMQ)...'
    );

    if (job.data.simulateFailure && job.attemptsMade < 2) {
      const errorMsg = `Simulated failure on attempt ${job.attemptsMade + 1}`;
      logger.error(
        {
          jobId: job.id,
          attempts: job.attemptsMade,
          timestamp: new Date(),
        },
        errorMsg
      );
      throw new Error(errorMsg);
    }

    await sleep(1000);

    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();

    logger.info(
      {
        jobId: job.id,
        to: job.data.to,
        duration,
        timestamp: endTime,
      },
      'Email job completed (BullMQ).'
    );
    return { success: true, duration };
  },
  { connection: redisOptions }
);

emailWorker.on('completed', (job: Job) => {
  logger.info({ jobId: job.id }, 'Job completed.');
});

emailWorker.on('failed', (job: Job | undefined, err: Error) => {
  logger.error({ jobId: job?.id, error: err.message }, 'Job failed.');
});
