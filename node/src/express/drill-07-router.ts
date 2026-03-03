import express, { Request, Response, NextFunction, Router } from "express";

const app = express();
const PORT= process.env.PORT || 3000;

const userRouter: Router = express.Router();

userRouter.use((req: Request, res: Response, next: NextFunction) => {
  console.log("[TS-USER ROUTER] Access log");
  next();
});

userRouter.get("/", (req: Request, res: Response) => {
  res.json({ users: ["divya", "asha"] });
});

userRouter.get("/:id", (req: Request<{ id: string }>, res: Response) => {
  res.json({ user: `User ${req.params.id} via TS router` });
});

const postRouter: Router = express.Router();

postRouter.get("/", (req: Request, res: Response) => {
  res.json({ posts: ["Hello Express TS", "Sub-routers are powerful"] });
});

app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Router Organization Drill (TS). Visit /api/users or /api/posts");
});

const server = app.listen(PORT, () => {
  console.log(`TS Server is running on http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    process.exit(0);
  });
});
