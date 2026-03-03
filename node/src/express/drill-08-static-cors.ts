import express, { Request, Response, NextFunction } from "express";
import cors, { CorsOptions } from "cors";
import path from "path";

const app = express();
const PORT: string | number = process.env.PORT || 3000;

// 1. Serving static files with TS + modern __dirname equivalent
app.use("/static", express.static(path.join(import.meta.dirname, "public")));

// 2. Manual CORS implementation (Custom Middleware) - Typed
const manualCors = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // 5. Handle preflight OPTIONS
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
};

app.get("/manual-cors", manualCors, (req: Request, res: Response) => {
  res.json({ message: "Manual CORS headers set via TS middleware" });
});

// 4. Route-specific CORS policy (Typed CorsOptions)
const corsOptions: CorsOptions = {
  origin: "http://example.com",
  optionsSuccessStatus: 200,
};

app.get(
  "/restricted-cors",
  cors(corsOptions),
  (req: Request, res: Response) => {
    res.json({ message: "TS route only allows example.com" });
  },
);

app.get("/open-cors", cors(), (req: Request, res: Response) => {
  res.json({ message: "TS route is open to everyone via global cors" });
});

app.get("/", (req: Request, res: Response) => {
  res.send(
    "Static Files & CORS TS Drill. Visit /static, /manual-cors, /open-cors, or /restricted-cors",
  );
});

const server = app.listen(PORT, () => {
  console.log(`TS Server is running on http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    process.exit(0);
  });
});
