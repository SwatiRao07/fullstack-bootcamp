import express from "express";
import morgan from "morgan";
import "dotenv/config";
import { pool } from "./config/database";
import userRoutes from "./routes/users";
import taskRoutes from "./routes/tasks";
import { errorHandler } from "./middleware/error";

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// Error Handling
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Graceful Shutdown (Drill 6)
const shutdown = async () => {
  console.log("\nShutting down gracefully...");
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
