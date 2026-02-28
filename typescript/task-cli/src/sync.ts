import { Storage } from './storage';
import { TaskCollection } from './collection';

export interface SyncResult {
  status: 'success' | 'failure';
  message: string;
  timestamp: Date;
}

export interface RemoteSync {
  push(data: TaskCollection): Promise<void>;
  pull(): Promise<TaskCollection>;
}

export class TaskSyncManager {
  constructor(
    private storage: Storage<TaskCollection>,
    private remote?: RemoteSync
  ) {}

  async save(data: TaskCollection): Promise<void> {
    await this.storage.save('tasks', data);
  }

  async load(): Promise<TaskCollection | null> {
    return await this.storage.load('tasks');
  }

  async sync(currentData: TaskCollection): Promise<SyncResult> {
    if (!this.remote) {
      return {
        status: 'failure',
        message: 'No remote sync configured',
        timestamp: new Date(),
      };
    }

    try {
      await this.remote.push(currentData);
      const remoteData = await this.remote.pull();
      // Simple merge logic: for now, remote wins or we just overwrite local.
      // Real sync would be more complex.
      await this.storage.save('tasks', remoteData);
      return {
        status: 'success',
        message: 'Sync completed successfully',
        timestamp: new Date(),
      };
    } catch (error: any) {
      return {
        status: 'failure',
        message: error.message || 'Unknown sync error',
        timestamp: new Date(),
      };
    }
  }
}
