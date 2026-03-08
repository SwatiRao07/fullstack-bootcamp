import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Error:", err.message);

  // Postgres specific error codes
  if (err.code === "23505") {
    return res.status(409).json({
      error: "Conflict",
      message: "Email already exists",
    });
  }

  if (err.code === "23514") {
    return res.status(400).json({
      error: "Bad Request",
      message: "Constraint violation: Title cannot be empty",
    });
  }

  if (err.code === "23503") {
    return res.status(400).json({
      error: "Bad Request",
      message: "Foreign key violation: User does not exist",
    });
  }

  res.status(500).json({
    error: "Internal Server Error",
    message: err.message || "Something went wrong",
  });
};
