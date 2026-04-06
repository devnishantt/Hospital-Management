import { Request, Response } from "express";
import { asyncHandler } from "../utils/common/asyncHandler";
import { sendSuccess } from "../utils/common/response";
import { STATUS_CODES } from "../utils/common/constants";
import { parsePagination } from "../utils/common/pagination";
import DoctorService from "../services/doctorService";

const doctorService = new DoctorService();

export const createDoctor = asyncHandler(
  async (req: Request, res: Response) => {
    const doctor = await doctorService.createDoctor(req.user!.id, req.body);
    sendSuccess(res, doctor, "Doctor profile created", STATUS_CODES.CREATED);
  },
);

export const getDoctor = asyncHandler(async (req: Request, res: Response) => {
  const doctor = await doctorService.getDoctor(req.params.id as string);
  sendSuccess(res, doctor, "Doctor fetched", STATUS_CODES.OK);
});

export const updateDoctor = asyncHandler(
  async (req: Request, res: Response) => {
    const doctor = await doctorService.updateDoctor(
      req.params.id as string,
      req.user!.id,
      req.user!.role,
      req.body,
    );
    sendSuccess(res, doctor, "Doctor updated", STATUS_CODES.OK);
  },
);

export const listDoctors = asyncHandler(async (req: Request, res: Response) => {
  const params = parsePagination(req.query);
  const filters = {
    specialization: req.query.specialization as string,
    departmentId: req.query.departmentId as string,
    isAvailable:
      req.query.isAvailable !== undefined
        ? req.query.isAvailable === "true"
        : undefined,
  };
  const doctors = await doctorService.listDoctors(params, filters);
  sendSuccess(res, doctors, "Doctors fetched", STATUS_CODES.OK);
});

export const getAvailableDoctors = asyncHandler(
  async (_req: Request, res: Response) => {
    const doctors = await doctorService.getAvailableDoctors();
    sendSuccess(res, doctors, "Available doctors fetched", STATUS_CODES.OK);
  },
);

export const searchDoctors = asyncHandler(
  async (req: Request, res: Response) => {
    const doctors = await doctorService.searchBySpecialization(
      req.query.specialization as string,
    );
    sendSuccess(res, doctors, "Search results", STATUS_CODES.OK);
  },
);

export const deleteDoctor = asyncHandler(
  async (req: Request, res: Response) => {
    await doctorService.deleteDoctor(req.params.id as string, req.user!.id);
    sendSuccess(res, null, "Doctor deleted", STATUS_CODES.OK);
  },
);

export const createSchedule = asyncHandler(
  async (req: Request, res: Response) => {
    const schedule = await doctorService.createSchedule(
      req.params.id as string,
      req.user!.id,
      req.body,
    );
    sendSuccess(res, schedule, "Schedule created", STATUS_CODES.CREATED);
  },
);

export const getSchedules = asyncHandler(
  async (req: Request, res: Response) => {
    const schedules = await doctorService.getSchedules(req.params.id as string);
    sendSuccess(res, schedules, "Schedules fetched", STATUS_CODES.OK);
  },
);

export const updateSchedule = asyncHandler(
  async (req: Request, res: Response) => {
    const schedule = await doctorService.updateSchedule(
      req.params.scheduleId as string,
      req.user!.id,
      req.body,
    );
    sendSuccess(res, schedule, "Schedule updated", STATUS_CODES.OK);
  },
);

export const deleteSchedule = asyncHandler(
  async (req: Request, res: Response) => {
    await doctorService.deleteSchedule(req.params.scheduleId as string, req.user!.id);
    sendSuccess(res, null, "Schedule deleted", STATUS_CODES.OK);
  },
);
