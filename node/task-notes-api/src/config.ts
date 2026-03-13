import dotenv from 'dotenv';

dotenv.config();

export interface AppConfig {
  port: number;
  logLevel: string;
  env: 'development' | 'production' | 'test';
  dataPath: string;
  userDbPath: string;
  jwtSecret: string;
  redisUrl: string; // empty string means Redis is disabled
  corsOrigin: string;
}

export function loadConfig(): AppConfig {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is required');
  }

  return {
    port: parseInt(process.env.PORT!, 10),
    logLevel: process.env.LOG_LEVEL || 'info', // 'info' is a safe operational default, not a secret
    env: (process.env.NODE_ENV as any)!,
    dataPath: process.env.DATA_PATH!,
    userDbPath: process.env.USER_DB_PATH!,
    jwtSecret: jwtSecret,
    redisUrl: process.env.REDIS_URL || '', 
    corsOrigin: process.env.CORS_ORIGIN!,
  };
}
