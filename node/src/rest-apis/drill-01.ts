import express from "express";

const app = express();
app.use(express.json());

// List all (GET /tasks) - 200 OK
app.get("/tasks", (req, res) => {
  res.status(200).json([{ id: 1, title: "Task 1" }]);
});

// Create (POST /tasks) - 201 Created
app.post("/tasks", (req, res) => {
  res.status(201).json({ id: 2, title: "Task 2" });
});

// Single resource (GET /tasks/:id) - 200 OK
app.get("/tasks/:id", (req, res) => {
  res.status(200).json({ id: 1, title: "Task 1" });
});

// Full update (PUT /tasks/:id) - 200 OK
app.put("/tasks/:id", (req, res) => {
  res.status(200).json({ id: 1, title: "Updated" });
});

// Delete (DELETE /tasks/:id) - 204 No Content
app.delete("/tasks/:id", (req, res) => {
  res.status(204).send();
});

// Nested resource (/users/:id/tasks)
app.get("/users/:id/tasks", (req, res) => {
  res.status(200).json([{ id: 1, userId: req.params.id }]);
});

app.listen(3000);
