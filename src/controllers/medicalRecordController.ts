import { Request, Response } from "express";
import { asyncHandler } from "../utils/common/asyncHandler";
import { sendSuccess } from "../utils/common/response";
import { STATUS_CODES } from "../utils/common/constants";
import { parsePagination } from "../utils/common/pagination";
import MedicalRecordService from "../services/medicalRecordService";

const medicalRecordService = new MedicalRecordService();

export const createRecord = asyncHandler(
  async (req: Request, res: Response) => {
    const record = await medicalRecordService.createRecord(
      req.user!.id,
      req.body,
      req.file?.buffer,
    );
    sendSuccess(res, record, "Medical record created", STATUS_CODES.CREATED);
  },
);

export const getRecord = asyncHandler(async (req: Request, res: Response) => {
  const record = await medicalRecordService.getRecord(req.params.id as string);
  sendSuccess(res, record, "Medical record fetched", STATUS_CODES.OK);
});

export const getByPatient = asyncHandler(
  async (req: Request, res: Response) => {
    const records = await medicalRecordService.getByPatient(
      req.params.patientId as string,
    );
    sendSuccess(res, records, "Patient records fetched", STATUS_CODES.OK);
  },
);

export const updateRecord = asyncHandler(
  async (req: Request, res: Response) => {
    const record = await medicalRecordService.updateRecord(
      req.params.id as string,
      req.user!.id,
      req.body,
      req.file?.buffer,
    );
    sendSuccess(res, record, "Medical record updated", STATUS_CODES.OK);
  },
);

export const deleteRecord = asyncHandler(
  async (req: Request, res: Response) => {
    await medicalRecordService.deleteRecord(req.params.id as string, req.user!.id);
    sendSuccess(res, null, "Medical record deleted", STATUS_CODES.OK);
  },
);

export const listRecords = asyncHandler(async (req: Request, res: Response) => {
  const params = parsePagination(req.query);
  const filters = {
    patientId: req.query.patientId as string,
    recordType: req.query.recordType as string,
  };
  const records = await medicalRecordService.listRecords(params, filters);
  sendSuccess(res, records, "Records fetched", STATUS_CODES.OK);
});
