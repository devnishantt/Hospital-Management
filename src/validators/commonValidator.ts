import { z } from "zod";

const uuidSchema = z.uuid({ error: "Invalid ID format" });

export const uuidParamSchema = z
  .object({
    id: uuidSchema,
  })
  .strict();

export const paginationQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    sortBy: z.string().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  })
  .strict();

export const dateRangeSchema = z
  .object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  })
  .strict();
