import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Express.');
});

app.get('/ping', (req: Request, res: Response) => {
  res.json({ ok: true });
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  console.log('\nShutting down.');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
