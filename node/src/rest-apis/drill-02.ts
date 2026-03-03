import express from "express";

const app = express();
app.use(express.json());
const PORT= 3000

let tasks = [{ id: 1, title: "Task 1" }];

app.get("/tasks", (req, res) => res.json(tasks));

app.post("/tasks", (req, res) => {
  const newTask = { id: tasks.length + 1, title: req.body.title };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.get("/tasks/:id", (req: any, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  task ? res.json(task) : res.status(404).send();
});

app.put("/tasks/:id", (req: any, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (task) Object.assign(task, req.body);
  task ? res.json(task) : res.status(404).send();
});

app.delete("/tasks/:id", (req: any, res) => {
  tasks = tasks.filter((t) => t.id !== parseInt(req.params.id));
  res.status(204).send();
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
