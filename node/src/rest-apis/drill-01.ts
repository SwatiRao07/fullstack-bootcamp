import express from 'express';

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get('/tasks', (req, res) => {
  res.status(200).json([{ id: 1, title: 'Task 1' }]);
});

app.post('/tasks', (req, res) => {
  res.status(201).json({ id: 2, title: 'Task 2' });
});

app.get('/tasks/:id', (req, res) => {
  res.status(200).json({ id: 1, title: 'Task 1' });
});

app.put('/tasks/:id', (req, res) => {
  res.status(200).json({ id: 1, title: 'Updated' });
});

app.delete('/tasks/:id', (req, res) => {
  res.status(204).send();
});

app.get('/users/:id/tasks', (req, res) => {
  res.status(200).json([{ id: 1, userId: req.params.id }]);
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
