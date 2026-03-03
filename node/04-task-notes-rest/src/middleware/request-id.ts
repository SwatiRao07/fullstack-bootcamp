import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

declare global {
  namespace Express {
    interface Request {
      id: string;
      startTime: number;
    }
  }
}

export const requestId = (req: Request, res: Response, next: NextFunction) => {
  req.id = Array.isArray(req.headers["x-request-id"])
    ? req.headers["x-request-id"][0]
    : (req.headers["x-request-id"] as string) || uuidv4();

  req.startTime = Date.now();
  res.setHeader("X-Request-Id", req.id);
  next();
};
