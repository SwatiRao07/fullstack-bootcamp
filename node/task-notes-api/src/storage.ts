import fs from 'fs/promises';
import { watch } from 'fs';
import path from 'path';
import { logger } from './logger.js';

export class FileStorage {
  constructor(private dataPath: string) {}

  async saveNotes(notes: any[]): Promise<void> {
    try {
      const dir = path.dirname(this.dataPath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(this.dataPath, JSON.stringify(notes, null, 2), 'utf-8');
      logger.debug('Notes saved to file');
    } catch (error) {
      logger.error({ error }, 'Failed to save notes');
      throw error;
    }
  }

  async loadNotes(): Promise<any[]> {
    try {
      const content = await fs.readFile(this.dataPath, 'utf-8');
      return JSON.parse(content);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return [];
      }
      logger.error({ error }, 'Failed to load notes');
      throw error;
    }
  }

  watchChanges(callback: () => void): void {
    const dir = path.dirname(this.dataPath);
    watch(dir, (event, filename) => {
      if (filename === path.basename(this.dataPath)) {
        logger.info('Data file changed on disk, reloading...');
        callback();
      }
    });
  }
}
