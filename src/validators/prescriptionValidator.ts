import { z } from "zod";

export const createPrescriptionSchema = z.object({
  appointmentId: z.uuid("Invalid appointment ID"),
  diagnosis: z.string().min(2).max(2000),
  medicines: z.array(z.string().min(1)).min(1, "At least one medicine is required"),
  dosage: z.string().max(500).optional(),
  duration: z.string().max(200).optional(),
  notes: z.string().max(2000).optional(),
  followUpDate: z.coerce.date().optional(),
});

export const updatePrescriptionSchema = z.object({
  diagnosis: z.string().min(2).max(2000).optional(),
  medicines: z.array(z.string().min(1)).min(1).optional(),
  dosage: z.string().max(500).optional().nullable(),
  duration: z.string().max(200).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  followUpDate: z.coerce.date().optional().nullable(),
});
