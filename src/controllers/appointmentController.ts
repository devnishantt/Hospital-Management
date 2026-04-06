import { Request, Response } from "express";
import { asyncHandler } from "../utils/common/asyncHandler";
import { sendSuccess } from "../utils/common/response";
import { STATUS_CODES } from "../utils/common/constants";
import { parsePagination } from "../utils/common/pagination";
import AppointmentService from "../services/appointmentService";

const appointmentService = new AppointmentService();

export const bookAppointment = asyncHandler(async (req: Request, res: Response) => {
  const appointment = await appointmentService.bookAppointment(req.user!.id, req.body);
  sendSuccess(res, appointment, "Appointment booked", STATUS_CODES.CREATED);
});

export const getAppointment = asyncHandler(async (req: Request, res: Response) => {
  const appointment = await appointmentService.getAppointment(req.params.id as string);
  sendSuccess(res, appointment, "Appointment fetched", STATUS_CODES.OK);
});

export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const appointment = await appointmentService.updateStatus(
    req.params.id as string, req.user!.id, req.body.status, req.body.notes);
  sendSuccess(res, appointment, "Appointment status updated", STATUS_CODES.OK);
});

export const reschedule = asyncHandler(async (req: Request, res: Response) => {
  const appointment = await appointmentService.reschedule(req.params.id as string, req.user!.id, req.body);
  sendSuccess(res, appointment, "Appointment rescheduled", STATUS_CODES.OK);
});

export const cancelAppointment = asyncHandler(async (req: Request, res: Response) => {
  const appointment = await appointmentService.cancelAppointment(req.params.id as string, req.user!.id);
  sendSuccess(res, appointment, "Appointment cancelled", STATUS_CODES.OK);
});

export const getMyAppointments = asyncHandler(async (req: Request, res: Response) => {
  const appointments = await appointmentService.getMyAppointments(req.user!.id);
  sendSuccess(res, appointments, "My appointments fetched", STATUS_CODES.OK);
});

export const getByDoctor = asyncHandler(async (req: Request, res: Response) => {
  const appointments = await appointmentService.getByDoctor(req.params.doctorId as string);
  sendSuccess(res, appointments, "Doctor appointments fetched", STATUS_CODES.OK);
});

export const listAppointments = asyncHandler(async (req: Request, res: Response) => {
  const params = parsePagination(req.query);
  const filters = {
    status: req.query.status as string,
    doctorId: req.query.doctorId as string,
  };
  const appointments = await appointmentService.listAppointments(params, filters);
  sendSuccess(res, appointments, "Appointments fetched", STATUS_CODES.OK);
});
