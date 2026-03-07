import express from 'express';

const app = express();
app.use(express.json());
const PORT = 3000;

const sendProblem = (res: any, status: number, title: string, detail: string) =>
  res
    .status(status)
    .type('application/problem+json')
    .json({ status, title, detail, type: 'about:blank' });

app.get('/400', (req, res) => sendProblem(res, 400, 'Bad Request', 'Invalid input'));
app.get('/404', (req, res) => sendProblem(res, 404, 'Not Found', 'Resource missing'));
app.get('/500', (req, res) => {
  throw new Error('Explosion');
});

app.use((err: any, req: any, res: any, next: any) => {
  sendProblem(res, 500, 'Internal Server Error', err.message);
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
