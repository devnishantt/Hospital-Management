import { Request, Response } from "express";
import { asyncHandler } from "../utils/common/asyncHandler";
import { sendSuccess } from "../utils/common/response";
import { STATUS_CODES } from "../utils/common/constants";
import PrescriptionService from "../services/prescriptionService";

const prescriptionService = new PrescriptionService();

export const createPrescription = asyncHandler(async (req: Request, res: Response) => {
  const prescription = await prescriptionService.createPrescription(req.user!.id, req.body);
  sendSuccess(res, prescription, "Prescription created", STATUS_CODES.CREATED);
});

export const getPrescription = asyncHandler(async (req: Request, res: Response) => {
  const prescription = await prescriptionService.getPrescription(req.params.id as string);
  sendSuccess(res, prescription, "Prescription fetched", STATUS_CODES.OK);
});

export const getByAppointment = asyncHandler(async (req: Request, res: Response) => {
  const prescriptions = await prescriptionService.getByAppointment(req.params.appointmentId as string);
  sendSuccess(res, prescriptions, "Prescriptions fetched", STATUS_CODES.OK);
});

export const updatePrescription = asyncHandler(async (req: Request, res: Response) => {
  const prescription = await prescriptionService.updatePrescription(req.params.id as string, req.user!.id, req.body);
  sendSuccess(res, prescription, "Prescription updated", STATUS_CODES.OK);
});

export const deletePrescription = asyncHandler(async (req: Request, res: Response) => {
  await prescriptionService.deletePrescription(req.params.id as string, req.user!.id);
  sendSuccess(res, null, "Prescription deleted", STATUS_CODES.OK);
});
