import { Queue } from 'bullmq';
import { logger } from '../logger.js';

export class TaskScheduler {
  private reminderQueue: Queue | null = null;
  private cleanupQueue: Queue | null = null;

  constructor(redisUrl: string) {
    if (!redisUrl) {
      logger.warn('No Redis URL provided. Task scheduler disabled.');
      return;
    }

    try {
      const connection = { url: redisUrl };
      this.reminderQueue = new Queue('task-reminders', { connection });
      this.cleanupQueue = new Queue('system-cleanup', { connection });
      logger.info('Task scheduler initialized');
    } catch (err) {
      logger.warn('Task scheduler could not connect to Redis. Jobs disabled.');
    }
  }

  async scheduleReminder(taskId: string, dueDate: Date): Promise<void> {
    if (!this.reminderQueue) return;
    const delay = dueDate.getTime() - Date.now();
    if (delay > 0) {
      await this.reminderQueue.add('send-reminder', { taskId }, { delay });
      logger.info({ taskId, dueDate }, 'Reminder scheduled');
    }
  }

  async scheduleCleanup(): Promise<void> {
    if (!this.cleanupQueue) return;
    await this.cleanupQueue.add(
      'cleanup',
      {},
      {
        repeat: { pattern: '0 0 * * *' },
      }
    );
    logger.info('Cleanup job scheduled');
  }

  async close() {
    await this.reminderQueue?.close();
    await this.cleanupQueue?.close();
  }
}
