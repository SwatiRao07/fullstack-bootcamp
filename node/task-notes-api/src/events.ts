import { EventEmitter } from 'events';
import { logger } from './logger.js';

export class TaskEventEmitter extends EventEmitter {
  emitTaskCreated(task: any): void {
    logger.debug({ taskId: task.id }, 'Task created event');
    this.emit('task:created', task);
  }

  emitTaskUpdated(task: any): void {
    logger.debug({ taskId: task.id }, 'Task updated event');
    this.emit('task:updated', task);
  }

  emitTaskDeleted(id: string): void {
    logger.debug({ taskId: id }, 'Task deleted event');
    this.emit('task:deleted', id);
  }
}
