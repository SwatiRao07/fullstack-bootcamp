import axios from 'axios';
import axiosRetry from 'axios-retry';

const client = axios.create();

// Drill 4 logic: Simulate retries with exponential backoff
axiosRetry(client, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 100; // Simplified backoff for testing speed
  },
  retryCondition: (error) => {
    return error.response?.status === 500;
  },
});

export const fetchExternalData = async (userId: string | number) => {
  try {
    const response = await client.get(`https://api.example.com/external-profile/${userId}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      // Drill 4: Simulate 401 -> 502 Bad Gateway mapping
      const err = new Error('External Auth Failed');
      (err as any).status = 502;
      throw err;
    }
    throw error;
  }
};
