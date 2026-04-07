import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().min(10).max(15).optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(["USER", "DOCTOR", "ADMIN"]),
});

export const updateUserStatusSchema = z.object({
  isActive: z.boolean(),
});
