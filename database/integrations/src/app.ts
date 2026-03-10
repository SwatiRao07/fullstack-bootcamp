import express from "express";
import morgan from "morgan";
import "dotenv/config";
import { pool, checkHealth, query } from "./config/database";
import { startMigrations } from "./db/migrationRunner";
import { TaskRepository } from "./repositories/TaskRepository";
import { UserRepository } from "./repositories/UserRepository";
import { projectService } from "./services/projectService";
import { errorHandler } from "./middleware/error";

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.json());

const userRepository = new UserRepository();
const taskRepository = new TaskRepository();

app.post("/api/admin/migrate", async (req, res) => {
  try {
    await startMigrations();
    res.json({ message: "Migrations executed." });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.get("/api/health", async (req, res) => {
  const health = await checkHealth();
  res.status(health.status === "OK" ? 200 : 503).json(health);
});

app.post("/api/users", async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await userRepository.create(email);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

app.get("/api/users", async (req, res, next) => {
  try {
    const users = await userRepository.findAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

app.post("/api/projects", async (req, res, next) => {
  try {
    const { name, tasks } = req.body;
    const result = await projectService.createProjectWithTasks(name, tasks);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

app.get("/api/slow", async (req, res, next) => {
  try {
    await query("SELECT pg_sleep(0.2)");
    res.json({ message: "Completed slow operation (simulated)" });
  } catch (err) {
    next(err);
  }
});

app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const shutdown = async () => {
  console.log("\nShutting down gracefully.");
  server.close(async () => {
    console.log("HTTP server closed.");
    await pool.end();
    console.log("Database pool closed.");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export default app;
