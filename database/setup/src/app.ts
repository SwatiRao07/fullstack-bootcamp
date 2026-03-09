import express from "express";
import morgan from "morgan";
import "dotenv/config";
import { pool } from "./config/database";
import userRoutes from "./routes/users";
import taskRoutes from "./routes/tasks";
import { errorHandler } from "./middleware/error";
import categoryRoutes from "../../data-modeling/drill-01-one-to-many/categoryRoutes";
import tagRoutes from "../../data-modeling/drill-02-many-to-many/tagRoutes";

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tags", tagRoutes);

app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

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
