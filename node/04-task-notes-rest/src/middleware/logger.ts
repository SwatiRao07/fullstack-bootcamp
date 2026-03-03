import pino from "pino";
import { Request, Response, NextFunction } from "express";

const pinoInstance = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname,req,res,responseTime",
    },
  },
});

export const logger = pinoInstance;

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { method, url } = req;
  const requestId = req.id;

  res.on("finish", () => {
    const elapsed = Date.now() - (req.startTime || Date.now());
    const statusCode = res.statusCode;

    logger.info({
      requestId,
      method,
      url,
      statusCode,
      latency: `${elapsed}ms`,
      msg: `${method} ${url} - ${statusCode} in ${elapsed}ms`,
    });
  });

  next();
};
