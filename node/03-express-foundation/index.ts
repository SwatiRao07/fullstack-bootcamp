import express, { Request, Response, NextFunction } from "express";

const app = express();
const PORT = process.env.PORT || 3000;
const VERSION = "1.0.0";
const startTime = Date.now();

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

app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});

app.get("/api/info", (req: Request, res: Response) => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  res.json({
    version: VERSION,
    uptime: `${uptimeSeconds}s`,
    environment: process.env.NODE_ENV || "development",
  });
});

app.post("/api/echo", (req: Request, res: Response) => {
  res.status(200).json(req.body);
});


app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("[Error]:", err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
  console.log("\nShutting down.");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
