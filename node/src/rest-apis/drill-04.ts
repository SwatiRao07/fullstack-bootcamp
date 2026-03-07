import express from 'express';

const app = express();
const PORT = 3000;
const tasks = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  completed: i % 2 === 0,
}));

app.get('/tasks', (req: any, res) => {
  const { page = '1', limit = '5', completed, sort = 'id', order = 'asc' } = req.query;
  const p = parseInt(page as string),
    l = parseInt(limit as string);

  let filtered = tasks;
  if (completed) filtered = tasks.filter((t) => String(t.completed) === completed);

  filtered.sort((a: any, b: any) => (a[sort] > b[sort] ? 1 : -1) * (order === 'desc' ? -1 : 1));

  const data = filtered.slice((p - 1) * l, p * l);
  res.json({ data, metadata: { total: filtered.length, page: p, limit: l } });
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
