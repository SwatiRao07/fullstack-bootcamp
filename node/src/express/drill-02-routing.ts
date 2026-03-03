import express, { Request, Response } from "express";

const app = express();
const PORT: string | number = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Basic Routing Drills (TS)");
});

app.get("/users/:id", (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  res.json({ userId: id });
});

app.get("/search", (req: Request, res: Response) => {
  const { q } = req.query;

  res.json({
    message: "Search query received",
    query: q,
  });
});


app.get("/users/:id/posts", (req: Request, res: Response) => {
  const { id } = req.params;
  const { limit } = req.query;

  res.json({
    message: "User posts fetched",
    userId: id,
    limit,
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).send("404 - Not Found");
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