import express from "express";
import { z } from "zod";

const app = express();
app.use(express.json());

const taskSchema = z.object({ title: z.string().min(1) });
const querySchema = z.object({
  limit: z
    .string()
    .transform((v) => parseInt(v))
    .default(10),
});

const validate =
  (schema: z.ZodSchema, target: "body" | "query" = "body") =>
  (req: any, res: any, next: any) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) return res.status(400).json(result.error);
    req[target] = result.data;
    next();
  };

app.post("/tasks", validate(taskSchema), (req, res) => {
  res.status(201).json({ id: Date.now(), ...req.body });
});

app.get("/tasks", validate(querySchema, "query"), (req, res) => {
  res.json({ limitUsed: req.query.limit });
});

app.listen(3002);
