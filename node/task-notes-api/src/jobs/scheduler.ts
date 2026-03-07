import { Queue } from 'bullmq';
import { logger } from '../logger.js';

export class TaskScheduler {
  private reminderQueue: Queue;
  private cleanupQueue: Queue;

  constructor(redisUrl: string) {
    const connection = { url: redisUrl };
    this.reminderQueue = new Queue('task-reminders', { connection });
    this.cleanupQueue = new Queue('system-cleanup', { connection });
    logger.info('Task scheduler initialized');
  }

  async scheduleReminder(taskId: string, dueDate: Date): Promise<void> {
    const delay = dueDate.getTime() - Date.now();
    if (delay > 0) {
      await this.reminderQueue.add('send-reminder', { taskId }, { delay });
      logger.info({ taskId, dueDate }, 'Reminder scheduled');
    }
  }

  async scheduleCleanup(): Promise<void> {
    // Schedule recurring cleanup every day
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
    await this.reminderQueue.close();
    await this.cleanupQueue.close();
  }
}
