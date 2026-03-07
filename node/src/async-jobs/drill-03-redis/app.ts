import express from 'express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { emailQueue } from './email.queue.js';
import './email.worker.js';
import { logger } from '../../integrations/utils/logger.js';

const app = express();
app.use(express.json());

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [new BullMQAdapter(emailQueue)],
  serverAdapter: serverAdapter,
});

app.use('/admin/queues', serverAdapter.getRouter());

app.post('/email', async (req, res) => {
  const { to, subject, body, simulateFailure, idempotencyKey } = req.body;

  if (!to || !subject || !body) {
    return res.status(400).json({ error: 'to, subject and body are required.' });
  }

  const jobId = idempotencyKey || undefined;

  const job = await emailQueue.add(
    'sendEmail',
    {
      to,
      subject,
      body,
      simulateFailure,
    },
    { jobId }
  );

  logger.info({ jobId: job.id }, 'Job added via BullMQ.');
  res.status(202).json({ jobId: job.id, message: 'Job enqueued via BullMQ.' });
});

const PORT = 3002;
app.listen(PORT, () => {
  logger.info(`Server listening on http://localhost:${PORT}`);
  logger.info(`Inspect queues at http://localhost:${PORT}/admin/queues`);
});

export default app;
