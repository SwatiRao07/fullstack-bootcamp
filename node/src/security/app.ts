import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth";
import { authenticate, AuthRequest } from "./middleware/auth";
import { requireRole } from "./middleware/role";

const app = express();

// Drill 7: Security Middleware
app.use(helmet()); // Sets various security headers
app.use(cors({ origin: "http://localhost:3000" })); // Drill 7: CORS allow specific origin
app.disable("x-powered-by"); // Drill 7: Disable X-Powered-By

// Drill 7: Rate Limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per window
  message: { error: "Too many login attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Drill 7 & 8: Request size limit and consistent formatting
app.use(express.json({ limit: "1mb" }));

// Logging failed attempts (Drill 8)
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

// Routes
app.use("/auth", loginLimiter, authRoutes);

// Drill 5: Protected /profile route
app.get("/profile", authenticate, (req: AuthRequest, res) => {
  res.json({ message: "Welcome to your profile", user: req.user });
});

// Drill 6: Protected /admin route
app.get("/admin", authenticate, requireRole("admin"), (req, res) => {
  res.json({ message: "Welcome, Admin!" });
});

// Drill 8: Brute force simulation endpoint (for testing)
app.get("/test-brute-force", (req, res) => {
  res.send("Testing rate limit. Refresh many times.");
});

// Standard Error Handler
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
