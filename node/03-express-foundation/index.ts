import express, { Request, Response, NextFunction } from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;
const VERSION = "1.0.0";
const startTime = Date.now();

// Middleware: Request Logger
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${timestamp}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`,
    );
  });

  next();
});

// Middleware: JSON Parsing
app.use(express.json());

// Routes
// 1. /health
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});

// 2. /api/info
app.get("/api/info", (req: Request, res: Response) => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  res.json({
    version: VERSION,
    uptime: `${uptimeSeconds}s`,
    environment: process.env.NODE_ENV || "development",
  });
});

// 3. /api/echo
app.post("/api/echo", (req: Request, res: Response) => {
  res.status(200).json(req.body);
});

// 4. Static Files
app.use(express.static(path.join(import.meta.dirname, "public")));

// 5. Error Handling for all routes
// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Generic Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("[Error]:", err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// 6. Graceful Shutdown on SIGINT
process.on("SIGINT", () => {
  console.log("\nShutting down.");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
