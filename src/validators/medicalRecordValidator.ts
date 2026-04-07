import { z } from "zod";

const recordTypeEnum = z.enum([
  "LAB_REPORT",
  "IMAGING",
  "DISCHARGE_SUMMARY",
  "CLINICAL_NOTE",
  "OTHER",
]);

export const createMedicalRecordSchema = z.object({
  patientId: z.uuid("Invalid patient ID"),
  title: z.string().min(2).max(200),
  description: z.string().max(2000).optional(),
  recordType: recordTypeEnum.optional().default("OTHER"),
});

export const updateMedicalRecordSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
  recordType: recordTypeEnum.optional(),
});
