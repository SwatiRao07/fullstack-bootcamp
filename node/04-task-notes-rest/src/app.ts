import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import taskRouter from "./routes/tasks.js";
import metricsRouter from "./routes/metrics.js";
import { requestId } from "./middleware/request-id.js";
import { requestLogger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/error-handler.js";
import { openapiSpec } from "./docs/openapi-spec.js";

const app = express();

// Global Middlewares
app.use(cors());
app.use(requestId);
app.use(express.json());
app.use(requestLogger);

// Documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

// Routes
app.use("/api/tasks", taskRouter);
app.use("/metrics", metricsRouter);

// Basic health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    requestId: req.id,
  });
});

// Error handling
app.use(errorHandler);

export default app;
