export enum TaskErrorCode {
  NOT_FOUND = 'TASK_NOT_FOUND',
  INVALID_INPUT = 'INVALID_INPUT',
  STORAGE_ERROR = 'STORAGE_ERROR',
  SYNC_ERROR = 'SYNC_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR'
}

export class TaskError extends Error {
  constructor(
    message: string,
    public code: TaskErrorCode,
    public context?: object
  ) {
    super(message);
    this.name = 'TaskError';
  }
}
