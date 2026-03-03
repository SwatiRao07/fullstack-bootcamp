import express, { Request, Response } from "express";
import path from "path";

const app = express();
const PORT = 3000;


// 200 OK
app.get("/ok", (req: Request, res: Response) => {
  res.status(200).json({ message: "Everything is fine" });
});

// 201 Created
app.post("/created", (req: Request, res: Response) => {
  res.status(201).json({ message: "Resource created successfully" });
});

// 400 Bad Request
app.get("/bad-request", (req: Request, res: Response) => {
  res.status(400).json({ error: "Invalid input" });
});

// 404 Not Found
app.get("/not-found", (req: Request, res: Response) => {
  res.status(404).json({ error: "Resource not found" });
});


app.get("/custom-header", (req: Request, res: Response) => {
  res.setHeader("X-App-Name", "Express-Drills");
  res.status(200).json({ message: "Custom header set" });
});


// JSON
app.get("/json", (req: Request, res: Response) => {
  res.json({ type: "json response" });
});

// Plain text
app.get("/text", (req: Request, res: Response) => {
  res.type("text/plain");
  res.send("This is a plain text response");
});

app.get("/file", (req: Request, res: Response) => {
  res.sendFile(path.resolve("test.txt"));
});

app.get("/redirect", (req: Request, res: Response) => {
  res.redirect("/ok");
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


