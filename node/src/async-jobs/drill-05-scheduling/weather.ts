import axios from 'axios';
import { db } from '../common/db.js';
import { logger } from '../../integrations/utils/logger.js';

const WEATHER_API_URL = 'http://api.weatherapi.com/v1/current.json';
const API_KEY = process.env.WEATHER_API_KEY || 'fake-key';

export const fetchAndStoreWeather = async (city: string) => {
  const startTime = Date.now();
  logger.info({ city }, 'Fetching weather data...');

  try {
    if (API_KEY === 'fake-key') {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const fakeData = {
        current: {
          temp_c: 25 + Math.random() * 5,
          condition: { text: 'Sunny' },
        },
      };

      const duration = Date.now() - startTime;

      db.prepare(
        `
                INSERT INTO weather_logs (city, temperature, condition, duration_ms)
                VALUES (?, ?, ?, ?)
            `
      ).run(city, fakeData.current.temp_c, fakeData.current.condition.text, duration);

      logger.info(
        { city, temp: fakeData.current.temp_c, duration },
        'Weather data stored successfully (mocked).'
      );
      return;
    }

    const response = await axios.get(`${WEATHER_API_URL}?key=${API_KEY}&q=${city}`);
    const data = response.data;
    const duration = Date.now() - startTime;

    db.prepare(
      `
            INSERT INTO weather_logs (city, temperature, condition, duration_ms)
            VALUES (?, ?, ?, ?)
        `
    ).run(city, data.current.temp_c, data.current.condition.text, duration);

    logger.info({ city, temp: data.current.temp_c, duration }, 'Weather data stored successfully.');
  } catch (error) {
    logger.error({ city, error: (error as Error).message }, 'Failed to fetch weather data.');
  }
};
