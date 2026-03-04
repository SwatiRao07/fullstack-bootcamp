import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth";
import { authenticate, AuthRequest } from "./middleware/auth";
import { requireRole } from "./middleware/role";

const app = express();

app.use(helmet());
app.use(cors({ origin: "http://localhost:3000" })); 
app.disable("x-powered-by");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: "Too many login attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json({ limit: "1mb" }));

app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function (body) {
    if (res.statusCode >= 400 && req.originalUrl.includes("/login")) {
      console.log(
        `[AUTH FAILURE] ${new Date().toISOString()} | IP: ${req.ip} | Method: ${req.method} | URL: ${req.originalUrl} | Status: ${res.statusCode}`,
      );
    }
    return originalSend.apply(res, arguments as any);
  };
  next();
});


app.use("/auth", loginLimiter, authRoutes);

app.get("/profile", authenticate, (req: AuthRequest, res) => {
  res.json({ message: "Welcome to your profile", user: req.user });
});

app.get("/admin", authenticate, requireRole("admin"), (req, res) => {
  res.json({ message: "Welcome, Admin!" });
});

app.get("/test-brute-force", (req, res) => {
  res.send("Testing rate limit. Refresh many times.");
});

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  },
);

export default app;
