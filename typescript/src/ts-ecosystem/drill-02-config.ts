import * as path from "node:path";
import * as dotenv from "dotenv";
import { z } from "zod";

// Load .env from this directory
dotenv.config({
  path: path.resolve(import.meta.dirname, ".env"),
});

// Define schema
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

// Validate immediately (throws automatically if invalid)
export const config = schema.parse(process.env);

// Export type
export type AppConfig = typeof config;

// Demo
console.log("Config loaded!");
console.log("PORT:", config.PORT);
console.log("NODE_ENV:", config.NODE_ENV);