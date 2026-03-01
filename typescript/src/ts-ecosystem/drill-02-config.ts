import * as path from "node:path";
import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config({
  path: path.resolve(import.meta.dirname, ".env"),
});

const schema = z.object({
  PORT: z.coerce
    .number()
    .int()
    .min(1)
    .max(65535),

  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export const config = schema.parse(process.env);

export type AppConfig = typeof config;

console.log("Config loaded!");
console.log("PORT:", config.PORT);
console.log("NODE_ENV:", config.NODE_ENV);