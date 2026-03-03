import express, { Request, Response, NextFunction } from "express";

const app = express();
const PORT= process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.post("/echo", (req: Request, res: Response) => {
  res.json({
    message: "Body received",
    body: req.body,
  });
});

app.post("/form", (req: Request, res: Response) => {
  res.json({
    received: req.body,
    type: "form-data",
  });
});

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

