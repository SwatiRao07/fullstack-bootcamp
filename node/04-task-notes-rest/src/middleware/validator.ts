import { Request, Response, NextFunction } from "express";
import { Schema, ZodError } from "zod";

export const validate = (
  schema: Schema,
  source: "body" | "query" | "params" = "body",
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data =
        source === "body"
          ? req.body
          : source === "query"
            ? req.query
            : req.params;
      const validated = await schema.parseAsync(data);

      if (source === "body") req.body = validated;
      else if (source === "query") req.query = validated as any;
      else if (source === "params") req.params = validated as any;

      next();
    } catch (err) {
      next(err);
    }
  };
};
