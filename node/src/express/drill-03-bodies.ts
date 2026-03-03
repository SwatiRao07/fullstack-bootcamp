import express, { Request, Response, NextFunction } from "express";

const app = express();
const PORT: string | number = process.env.PORT || 3000;

// JSON and URL-encoded body parsing with limits
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Dynamic interface to represent the echoed body
// interface EchoBody {
//   [key: string]: any;
// }

// POST route echoing back the body (Request generic Body)
app.post("/echo", (req: Request, res: Response) => {
  res.json({
    message: "Body received",
    body: req.body,
  });
});

// Route for form data testing
app.post("/form", (req: Request, res: Response) => {
  res.json({
    received: req.body,
    type: "form-data",
  });
});

// Middleware to handle malformed JSON (Typed as Error handler)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      error: "Invalid JSON format",
    });
  }
  next();
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
