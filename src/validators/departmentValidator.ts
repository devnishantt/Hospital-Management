import { z } from "zod";

export const createDepartmentSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { error: "Department name is required" })
      .max(100),
    description: z.string().max(500).optional(),
  })
  .strict();

export const updateDepartmentSchema = createDepartmentSchema.partial().extend({
  description: z.string().max(500).optional().nullable(),
  isActive: z.boolean().optional(),
});
