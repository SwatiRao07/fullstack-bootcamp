import express from "express";
import pino from "pino";
import { v4 } from "uuid";

const logger = pino({ level: "debug", transport: { target: "pino-pretty" } });
const app = express();

app.use((req: any, res: any, next: any) => {
  req.id = v4();
  const start = Date.now();
  res.on("finish", () =>
    logger.info({
      id: req.id,
      status: res.statusCode,
      duration: Date.now() - start,
    }),
  );
  next();
});

app.post("/tasks", (req: any, res) => {
  logger.info({ id: req.id }, "task created");
  res.status(201).json({ id: 1 });
});

app.listen(3005);
