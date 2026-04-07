import { z } from "zod";

export const createDoctorSchema = z.object({
  specialization: z.string().trim().min(2).max(100),
  qualification: z.string().max(200).optional(),
  experience: z.number().int().min(0).max(60).optional(),
  consultationFee: z.number().positive().optional().default(500),
  departmentId: z.string().uuid().optional(),
});

export const updateDoctorSchema = createDoctorSchema
  .partial()
  .extend({
    qualification: z.string().max(200).optional().nullable(),
    experience: z.number().int().min(0).max(60).optional().nullable(),
    isAvailable: z.boolean().optional(),
    departmentId: z.uuid().optional().nullable(),
  });

export const createScheduleSchema = z.object({
  dayOfWeek: z
    .array(z.number().int().min(0).max(6))
    .min(1, { message: "At least one day is required" })
    .max(7),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, { message: "Format: HH:MM" }),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, { message: "Format: HH:MM" }),
  maxSlots: z.number().int().positive().optional().default(20),
});

export const updateScheduleSchema = createScheduleSchema.partial().extend({
  isActive: z.boolean().optional(),
});
