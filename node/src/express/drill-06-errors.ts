import express, { Request, Response, NextFunction } from 'express';

const app = express();
const PORT = 3000;

const isDev = process.env.NODE_ENV !== 'production';

app.get('/sync-error', (req, res) => {
  throw new Error('Sync route failed!');
});

app.get('/async-error', async (req, res) => {
  await Promise.reject(new Error('Async route failed!'));
});

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const status = 500;

  if (isDev) {
    res.status(status).json({
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(status).json({
      message: 'Internal Server Error',
    });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
