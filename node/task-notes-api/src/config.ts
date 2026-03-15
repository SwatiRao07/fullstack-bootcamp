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

  const port = process.env.PORT;
  if (!port) {
    throw new Error('PORT environment variable is required');
  }
  const parsedPort = parseInt(port, 10);
  if (isNaN(parsedPort)) {
    throw new Error(`PORT environment variable is not a valid number: ${port}`);
  }

  const dataPath = process.env.DATA_PATH;
  if (!dataPath) {
    throw new Error('DATA_PATH environment variable is required');
  }

  const userDbPath = process.env.USER_DB_PATH;
  if (!userDbPath) {
    throw new Error('USER_DB_PATH environment variable is required');
  }

  const corsOrigin = process.env.CORS_ORIGIN;
  if (!corsOrigin) {
    throw new Error('CORS_ORIGIN environment variable is required');
  }

  return {
    port: parsedPort,
    logLevel: process.env.LOG_LEVEL || 'info',
    env: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'production',
    dataPath: dataPath,
    userDbPath: userDbPath,
    jwtSecret: jwtSecret,
    redisUrl: process.env.REDIS_URL || '', 
    corsOrigin: corsOrigin,
  };
}
