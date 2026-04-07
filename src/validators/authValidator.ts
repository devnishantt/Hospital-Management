import { z } from "zod";

export const genderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);

const passwordSchema = z
  .string()
  .min(8, { error: "Password must be at least 8 characters" })
  .max(128)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/, {
    error:
      "Password must include uppercase, lowercase, number, and special character",
  });

const emailSchema = z.email({ error: "Invalid email address" });

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { error: "Name must be at least 2 characters" })
      .max(100),
    email: emailSchema,
    password: passwordSchema,
    phone: z.string().min(10).max(15).optional(),
    gender: genderEnum,
  })
  .strict();

export const loginSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1, { error: "Password is required" }),
  })
  .strict();

export const refreshTokenSchema = z
  .object({
    refreshToken: z.string().min(1, { error: "Refresh token is required" }),
  })
  .strict();

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { error: "Current password is required" }),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords do not match",
        code: "custom",
      });
    }
  });

export const enableTotpSchema = z
  .object({
    password: z
      .string()
      .min(1, { error: "Password is required to enable 2FA" }),
  })
  .strict();

export const verifyTotpSchema = z
  .object({
    token: z
      .string()
      .length(6, { error: "TOTP token must be 6 digits" })
      .regex(/^\d+$/, { error: "TOTP must contain only numbers" }),
  })
  .strict();
