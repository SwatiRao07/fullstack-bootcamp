import express, { Request, Response, NextFunction } from "express";

const app = express();
const PORT = 3000;

// Simulate environment
const isDev = process.env.NODE_ENV !== "production";

// --------------------
// Routes
// --------------------

// 1️⃣ Sync route that throws
app.get("/sync-error", (req, res) => {
  throw new Error("Sync route failed!");
});

// 2️⃣ Async route that throws
app.get("/async-error", async (req, res) => {
  await Promise.reject(new Error("Async route failed!"));
});

// 3️⃣ Normal route
app.get("/", (req, res) => {
  res.send("Hello world ✅");
});

// --------------------
// Error Handling Middleware (4 params!)
// --------------------
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const status = 500;

  if (isDev) {
    // Development: full error info
    res.status(status).json({
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Production: generic message
    res.status(status).json({
      message: "Internal Server Error",
    });
  }
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
