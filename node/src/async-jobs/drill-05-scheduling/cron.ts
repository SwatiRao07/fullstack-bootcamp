import cron from 'node-cron';
import { fetchAndStoreWeather } from './weather.js';
import { logger } from '../../integrations/utils/logger.js';
import { initDb } from '../common/db.js';

initDb();

export const startWeatherCron = () => {
  logger.info('Starting Weather Schedule Cron...');

  const job = cron.schedule('* * * * *', async () => {
    const city = 'London';
    const startTime = new Date();

    try {
      await fetchAndStoreWeather(city);
      logger.info(
        {
          city,
          timestamp: startTime,
          duration: Date.now() - startTime.getTime(),
        },
        'Weather cron job finished.'
      );
    } catch (err) {
      logger.error(
        { city, error: (err as Error).message },
        'Weather cron job failed. Will retry on next schedule.'
      );
    }
  });

  return job;
};
