import { z } from "zod";

const timeRegex = /^\d{2}:\d{2}$/;

const uuidSchema = z.uuidv4({ error: "Invalid doctor ID" });

export const createAppointmentSchema = z
  .object({
    doctorId: uuidSchema,
    date: z.coerce.date(),
    appointmentTime: z.string().regex(timeRegex, { error: "Format: HH:MM" }),
    reason: z.string().max(1000).optional(),
  })
  .strict();

export const updateAppointmentStatusSchema = z
  .object({
    status: z.enum([
      "SCHEDULED",
      "CONFIRMED",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELLED",
      "NO_SHOW",
    ]),
    notes: z.string().max(2000).optional(),
  })
  .strict();

export const rescheduleAppointmentSchema = z
  .object({
    date: z.coerce.date(),
    appointmentTime: z.string().regex(timeRegex, { error: "Format: HH:MM" }),
  })
  .strict();
