import { Appointment } from "../generated/prisma/client";
import BaseRepository from "./baseRepository";

export default class AppointmentRepository extends BaseRepository<Appointment> {
  constructor() {
    super("appointment");
  }

  async findByPatient(patientId: string): Promise<Appointment[]> {
    return this.findAll({
      where: { patientId },
      include: {
        doctor: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        payment: true,
      },
      orderBy: { date: "desc" },
    });
  }

  async findByDoctor(doctorId: string): Promise<Appointment[]> {
    return this.findAll({
      where: { doctorId },
      include: {
        patient: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        payment: true,
      },
      orderBy: { date: "desc" },
    });
  }

  async findByDateRange(
    doctorId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Appointment[]> {
    return this.findAll({
      where: {
        doctorId,
        date: { gte: startDate, lte: endDate },
        status: { notIn: ["CANCELLED", "NO_SHOW"] },
      },
    });
  }

  async findConflict(
    doctorId: string,
    date: Date,
    appointmentTime: string,
  ): Promise<Appointment | null> {
    return this.findOne({
      doctorId,
      date,
      appointmentTime,
      status: { notIn: ["CANCELLED", "NO_SHOW"] },
    });
  }

  async findWithDetails(appointmentId: string): Promise<Appointment> {
    return this.findById(appointmentId, {
      include: {
        patient: {
          include: {
            user: {
              select: { id: true, name: true, email: true, phone: true },
            },
          },
        },
        doctor: {
          include: {
            user: { select: { id: true, name: true, email: true } },
            department: { select: { id: true, name: true } },
          },
        },
        prescriptions: true,
        payment: true,
      },
    });
  }
}
