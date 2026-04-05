import { Request, Response } from "express";
import { asyncHandler } from "../utils/common/asyncHandler";
import { sendSuccess } from "../utils/common/response";
import { STATUS_CODES } from "../utils/common/constants";
import { parsePagination } from "../utils/common/pagination";
import PatientService from "../services/patientService";

const patientService = new PatientService();

export const createPatient = asyncHandler(
  async (req: Request, res: Response) => {
    const patient = await patientService.createPatient(req.user!.id, req.body);
    sendSuccess(res, patient, "Patient profile created", STATUS_CODES.CREATED);
  },
);

export const getPatient = asyncHandler(async (req: Request, res: Response) => {
  const patient = await patientService.getPatient(req.params.id as string);
  sendSuccess(res, patient, "Patient fetched", STATUS_CODES.OK);
});

export const getMyPatientProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const patient = await patientService.getPatientByUserId(req.user!.id);
    sendSuccess(res, patient, "Patient profile fetched", STATUS_CODES.OK);
  },
);

export const updatePatient = asyncHandler(
  async (req: Request, res: Response) => {
    const patient = await patientService.updatePatient(
      req.params.id as string,
      req.user!.id,
      req.user!.role,
      req.body,
    );
    sendSuccess(res, patient, "Patient updated", STATUS_CODES.OK);
  },
);

export const listPatients = asyncHandler(
  async (req: Request, res: Response) => {
    const params = parsePagination(req.query);
    const patients = await patientService.listPatients(params);
    sendSuccess(res, patients, "Patients fetched", STATUS_CODES.OK);
  },
);

export const deletePatient = asyncHandler(
  async (req: Request, res: Response) => {
    await patientService.deletePatient(req.params.id as string, req.user!.id);
    sendSuccess(res, null, "Patient deleted", STATUS_CODES.OK);
  },
);
