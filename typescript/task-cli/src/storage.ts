import fs from 'fs/promises';
import path from 'path';

export interface Storage<T> {
  save(key: string, data: T): Promise<void>;
  load(key: string): Promise<T | null>;
  list(): Promise<string[]>;
}

export class FileStorage<T> implements Storage<T> {
  constructor(private basePath: string) {}

  private getPath(key: string): string {
    return path.join(this.basePath, `${key}.json`);
  }

  async save(key: string, data: T): Promise<void> {
    const filePath = this.getPath(key);
    await fs.mkdir(this.basePath, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async load(key: string): Promise<T | null> {
    const filePath = this.getPath(key);
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }

  async list(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.basePath);
      return files
        .filter(f => f.endsWith('.json'))
        .map(f => f.replace('.json', ''));
    } catch (error) {
      return [];
    }
  }
}
