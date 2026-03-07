import express from 'express';

const app = express();
const PORT = 3000;
const metrics = { total: 0, ok: 0, err: 0, times: {} as any };

app.use((req: any, res: any, next: any) => {
  metrics.total++;
  const start = Date.now();
  res.on('finish', () => {
    res.statusCode < 400 ? metrics.ok++ : metrics.err++;
    const path = req.baseUrl + req.path;
    metrics.times[path] = {
      count: (metrics.times[path]?.count || 0) + 1,
      sum: (metrics.times[path]?.sum || 0) + (Date.now() - start),
    };
  });
  next();
});

const v1 = express.Router().get('/tasks', (req, res) => res.json({ v: 1 }));
const v2 = express.Router().get('/tasks', (req, res) => res.json({ v: 2 }));

app.use('/v1', v1);
app.use('/v2', v2);
app.get('/metrics', (req, res) => res.json(metrics));

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
