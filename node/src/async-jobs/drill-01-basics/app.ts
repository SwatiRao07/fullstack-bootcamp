import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { pushToQueue } from './queue.js';
import { startWorker, stopWorker } from './worker.js';
import { logger } from '../../integrations/utils/logger.js';

const app = express();
app.use(express.json());

app.post('/email', (req, res) => {
  const { to, subject, body } = req.body;

  if (!to || !subject || !body) {
    return res.status(400).json({ error: 'to, subject and body are required.' });
  }

  const jobId = uuidv4();
  const job = { id: jobId, to, subject, body, createdAt: new Date() };

  pushToQueue(job);
  logger.info({ jobId }, 'Job enqueued successfully.');

  res.status(202).json({
    message: 'Email job enqueued successfully.',
    jobId,
  });
});

const PORT = 3000;
const server = app.listen(PORT, () => {
  logger.info(`Server listening on http://localhost:${PORT}`);
  startWorker().catch((err) => {
    logger.error(err, 'Worker loop error.');
  });
});

const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Shutting down server and worker...`);

  server.close(() => {
    logger.info('HTTP server closed.');
  });

  await stopWorker();

  process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

export default app;
