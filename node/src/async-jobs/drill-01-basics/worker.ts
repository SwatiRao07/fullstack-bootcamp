import { popFromQueue, EmailJob } from './queue.js';
import { logger } from '../../integrations/utils/logger.js';

const isPaused = false;
let isShuttingDown = false;
let currentJob: EmailJob | null = null;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const startWorker = async () => {
  logger.info('Email Worker started...');

  while (!isShuttingDown) {
    if (isPaused) {
      await sleep(100);
      continue;
    }

    const job = popFromQueue();

    if (job) {
      currentJob = job;
      logger.info({ jobId: job.id, to: job.to }, 'Processing email job...');

      await sleep(1000);

      logger.info({ jobId: job.id, to: job.to }, 'Email job completed.');
      currentJob = null;
    } else {
      await sleep(100);
    }
  }

  logger.info('Worker loop terminated.');
};

export const stopWorker = async () => {
  isShuttingDown = true;
  logger.info('Stopping worker gracefully...');

  while (currentJob) {
    logger.info('Waiting for current job to finish...');
    await sleep(500);
  }

  logger.info('Worker stopped successfully.');
};
