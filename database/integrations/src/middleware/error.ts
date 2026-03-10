import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("[PG ERROR]:", err.message || err);

  if (err.code === "23505") {
    return res.status(409).json({
      error: "Conflict",
      message: "This resource (e.g. email or project name) already exists.",
    });
  }

  if (err.code === "23514") {
    return res.status(400).json({
      error: "Bad Request",
      message: "Constraint violation: One or more fields are invalid.",
    });
  }

  if (err.code === "23503") {
    return res.status(400).json({
      error: "Bad Request",
      message: "Reference violation: Dependency does not exist.",
    });
  }

  res.status(500).json({
    error: "Internal Server Error",
    message: err.message || "Something went wrong in the database layer.",
  });
};
