import pino from 'pino';
import { loadConfig } from './config.js';

const config = loadConfig();

export const logger = pino({
  level: config.logLevel,
  ...(config.env === 'development'
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      }
    : {}),
});
