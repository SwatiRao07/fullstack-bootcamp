import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "./logger.js";

export interface ApiError extends Error {
  status?: number;
  type?: string;
  detail?: string;
  instance?: string;
  errors?: any;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = err.status || 500;
  const requestId = req.id;

  logger.error({
    msg: err.message,
    requestId,
    stack: err.stack,
    status,
    url: req.url,
    method: req.method,
  });

  if (err instanceof ZodError) {
    return res.status(400).json({
      type: "https://api.task-notes.com/errors/validation-error",
      title: "Validation Failed",
      status: 400,
      detail: "The request payload contains invalid data.",
      instance: req.id,
      errors: err.errors.map(
        (e: { path: (string | number)[]; message: string }) => ({
          path: e.path.join("."),
          message: e.message,
        }),
      ),
    });
  }

  const errorResponse = {
    type: err.type || "https://api.task-notes.com/errors/internal-error",
    title: err.name || "Internal Server Error",
    status,
    detail: err.message || "An unexpected error occurred.",
    instance: req.id,
  };

  res.status(status).json(errorResponse);
};
