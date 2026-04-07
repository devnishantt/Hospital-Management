import { z } from "zod";

const bloodGroupEnum = z.enum([
  "A_POSITIVE", "A_NEGATIVE",
  "B_POSITIVE", "B_NEGATIVE",
  "AB_POSITIVE", "AB_NEGATIVE",
  "O_POSITIVE", "O_NEGATIVE",
]);

export const createPatientSchema = z.object({
  age: z.number().int().min(0).max(150),
  bloodGroup: bloodGroupEnum,
  dateOfBirth: z.coerce.date(),
  address: z.string().max(500).optional(),
  emergencyPhone: z.string().min(10).max(15).optional(),
  allergies: z.string().max(1000).optional(),
  medicalHistory: z.string().max(5000).optional(),
});

export const updatePatientSchema = z.object({
  age: z.number().int().min(0).max(150).optional(),
  bloodGroup: bloodGroupEnum.optional(),
  dateOfBirth: z.coerce.date().optional(),
  address: z.string().max(500).optional().nullable(),
  emergencyPhone: z.string().min(10).max(15).optional().nullable(),
  allergies: z.string().max(1000).optional().nullable(),
  medicalHistory: z.string().max(5000).optional().nullable(),
});
