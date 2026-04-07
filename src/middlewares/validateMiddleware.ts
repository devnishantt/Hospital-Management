import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import { ValidationError } from "../utils/errors/error";

export default function validate<T>(
  schema: ZodType<T>,
  property: keyof Request = "body",
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[property]);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        fields: issue.path.join(".") || property,
        message: issue.message,
      }));
      throw new ValidationError("Validation Failed", errors);
    }

    (req as any)[property] = result.data;
    next();
  };
}
