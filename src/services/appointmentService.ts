import AppointmentRepository from "../repositories/appointmentRepository";
import PatientRepository from "../repositories/patientRepository";
import DoctorRepository from "../repositories/doctorRepository";
import AuditLogRepository from "../repositories/auditLogRepository";
import NotificationRepository from "../repositories/notificationRepository";
import {
  ConflictError,
  ForbiddenError,
  ValidationError,
} from "../utils/errors/error";
import { sendAppointmentConfirmation } from "../utils/helpers/email";
import type { PaginationParams } from "../types";

const appointmentRepo = new AppointmentRepository();
const patientRepo = new PatientRepository();
const doctorRepo = new DoctorRepository();
const auditLogRepo = new AuditLogRepository();
const notifRepo = new NotificationRepository();

export default class AppointmentService {
  async bookAppointment(
    userId: string,
    data: {
      doctorId: string;
      date: Date;
      appointmentTime: string;
      reason?: string;
    },
  ) {
    const patient = await patientRepo.findByUserId(userId);
    if (!patient) {
      throw new ValidationError(
        "Patient profile required. Please create one first.",
      );
    }

    const doctor = await doctorRepo.findWithDetails(data.doctorId);
    if (!doctor.isAvailable) {
      throw new ValidationError("Doctor is not available for appointments.");
    }

    const conflict = await appointmentRepo.findConflict(
      data.doctorId,
      data.date,
      data.appointmentTime,
    );
    if (conflict) {
      throw new ConflictError(
        "This time slot is already booked. Please choose another.",
      );
    }

    const appointment = await appointmentRepo.create({
      patientId: patient.id,
      doctorId: data.doctorId,
      date: data.date,
      appointmentTime: data.appointmentTime,
      reason: data.reason,
    });

    await notifRepo.create({
      title: "New Appointment",
      message: `New appointment scheduled for ${data.date.toDateString()} at ${data.appointmentTime}`,
      type: "APPOINTMENT",
      userId: (doctor as any).userId,
    });

    sendAppointmentConfirmation(
      (patient as any).user?.email || "",
      (patient as any).user?.name || "Patient",
      (doctor as any).user?.name || "Doctor",
      data.date.toDateString(),
      data.appointmentTime,
    ).catch(() => {});

    await auditLogRepo.logAction({
      action: "BOOK_APPOINTMENT",
      entity: "Appointment",
      entityId: appointment.id,
      userId,
    });

    return appointment;
  }

  async getAppointment(appointmentId: string) {
    return appointmentRepo.findWithDetails(appointmentId);
  }

  async updateStatus(
    appointmentId: string,
    userId: string,
    status: string,
    notes?: string,
  ) {
    const appointment = await appointmentRepo.findWithDetails(appointmentId);

    const updateData: any = { status };
    if (notes) updateData.notes = notes;

    const updated = await appointmentRepo.update(appointmentId, updateData);

    await auditLogRepo.logAction({
      action: "UPDATE_APPOINTMENT_STATUS",
      entity: "Appointment",
      entityId: appointmentId,
      userId,
      details: { newStatus: status },
    });

    return updated;
  }

  async reschedule(
    appointmentId: string,
    userId: string,
    data: { date: Date; appointmentTime: string },
  ) {
    const appointment = await appointmentRepo.findById(appointmentId);

    if (
      appointment.status === "COMPLETED" ||
      appointment.status === "CANCELLED"
    ) {
      throw new ValidationError(
        `Cannot reschedule a ${appointment.status.toLowerCase()} appointment.`,
      );
    }

    const conflict = await appointmentRepo.findConflict(
      appointment.doctorId,
      data.date,
      data.appointmentTime,
    );
    if (conflict && conflict.id !== appointmentId) {
      throw new ConflictError("New time slot is already booked.");
    }

    const updated = await appointmentRepo.update(appointmentId, {
      date: data.date,
      appointmentTime: data.appointmentTime,
      status: "SCHEDULED",
    });

    await auditLogRepo.logAction({
      action: "RESCHEDULE_APPOINTMENT",
      entity: "Appointment",
      entityId: appointmentId,
      userId,
      details: { newDate: data.date, newTime: data.appointmentTime },
    });

    return updated;
  }

  async cancelAppointment(appointmentId: string, userId: string) {
    const appointment = await appointmentRepo.findById(appointmentId);

    if (appointment.status === "COMPLETED") {
      throw new ValidationError("Cannot cancel a completed appointment.");
    }

    const updated = await appointmentRepo.update(appointmentId, {
      status: "CANCELLED",
    });

    await auditLogRepo.logAction({
      action: "CANCEL_APPOINTMENT",
      entity: "Appointment",
      entityId: appointmentId,
      userId,
    });

    return updated;
  }

  async getByPatient(patientId: string) {
    return appointmentRepo.findByPatient(patientId);
  }

  async getByDoctor(doctorId: string) {
    return appointmentRepo.findByDoctor(doctorId);
  }

  async getMyAppointments(userId: string) {
    const patient = await patientRepo.findByUserId(userId);
    if (!patient) return [];
    return appointmentRepo.findByPatient(patient.id);
  }

  async listAppointments(
    params: PaginationParams,
    filters: { status?: string; doctorId?: string } = {},
  ) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.doctorId) where.doctorId = filters.doctorId;

    return appointmentRepo.findWithPagination(params, where, {
      include: {
        patient: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        doctor: {
          include: { user: { select: { id: true, name: true } } },
        },
      },
    });
  }
}
