import dotenv from 'dotenv';

dotenv.config();

export interface AppConfig {
  port: number;
  logLevel: string;
  env: 'development' | 'production' | 'test';
  dataPath: string;
  jwtSecret: string;
  redisUrl: string;
}

export function loadConfig(): AppConfig {
  return {
    port: parseInt(process.env.PORT || '3000', 10),
    logLevel: process.env.LOG_LEVEL || 'info',
    env: (process.env.NODE_ENV as any) || 'development',
    dataPath: process.env.DATA_PATH || './data/notes.json',
    jwtSecret: process.env.JWT_SECRET || 'super-secret-key',
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  };
}
