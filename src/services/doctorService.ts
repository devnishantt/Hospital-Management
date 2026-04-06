import DoctorRepository from "../repositories/doctorRepository";
import DoctorScheduleRepository from "../repositories/doctorScheduleRepository";
import AuditLogRepository from "../repositories/auditLogRepository";
import { ConflictError, ForbiddenError } from "../utils/errors/error";
import type { PaginationParams } from "../types";

const doctorRepo = new DoctorRepository();
const scheduleRepo = new DoctorScheduleRepository();
const auditLogRepo = new AuditLogRepository();

export default class DoctorService {
  async createDoctor(userId: string, data: any) {
    const existing = await doctorRepo.findByUserId(userId);
    if (existing) {
      throw new ConflictError("Doctor profile already exists for this user.");
    }

    const doctor = await doctorRepo.create({ ...data, userId });

    await auditLogRepo.logAction({
      action: "CREATE_DOCTOR",
      entity: "Doctor",
      entityId: doctor.id,
      userId,
    });

    return doctor;
  }

  async getDoctor(doctorId: string) {
    return doctorRepo.findWithDetails(doctorId);
  }

  async updateDoctor(
    doctorId: string,
    userId: string,
    role: string,
    data: any,
  ) {
    const doctor = await doctorRepo.findById(doctorId);

    if (role !== "ADMIN" && doctor.userId !== userId) {
      throw new ForbiddenError("You can only update your own doctor profile.");
    }

    const updated = await doctorRepo.update(doctorId, data);

    await auditLogRepo.logAction({
      action: "UPDATE_DOCTOR",
      entity: "Doctor",
      entityId: doctorId,
      userId,
    });

    return updated;
  }

  async listDoctors(
    params: PaginationParams,
    filters: {
      specialization?: string;
      departmentId?: string;
      isAvailable?: boolean;
    } = {},
  ) {
    const where: any = {};
    if (filters.specialization) {
      where.specialization = {
        contains: filters.specialization,
        mode: "insensitive",
      };
    }
    if (filters.departmentId) where.departmentId = filters.departmentId;
    if (filters.isAvailable !== undefined)
      where.isAvailable = filters.isAvailable;

    return doctorRepo.findWithPagination(params, where, {
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        department: { select: { id: true, name: true } },
      },
    });
  }

  async getAvailableDoctors() {
    return doctorRepo.findAvailable();
  }

  async searchBySpecialization(specialization: string) {
    return doctorRepo.findBySpecialization(specialization);
  }

  async createSchedule(doctorId: string, userId: string, data: any) {
    const doctor = await doctorRepo.findById(doctorId);
    if (doctor.userId !== userId) {
      throw new ForbiddenError("You can only manage your own schedule.");
    }

    return scheduleRepo.create({ ...data, doctorId });
  }

  async getSchedules(doctorId: string) {
    return scheduleRepo.findByDoctor(doctorId);
  }

  async updateSchedule(scheduleId: string, userId: string, data: any) {
    const schedule = await scheduleRepo.findById(scheduleId);
    const doctor = await doctorRepo.findById(schedule.doctorId);

    if (doctor.userId !== userId) {
      throw new ForbiddenError("You can only manage your own schedule.");
    }

    return scheduleRepo.update(scheduleId, data);
  }

  async deleteSchedule(scheduleId: string, userId: string) {
    const schedule = await scheduleRepo.findById(scheduleId);
    const doctor = await doctorRepo.findById(schedule.doctorId);

    if (doctor.userId !== userId) {
      throw new ForbiddenError("You can only manage your own schedule.");
    }

    return scheduleRepo.delete(scheduleId);
  }

  async deleteDoctor(doctorId: string, adminId: string) {
    await doctorRepo.delete(doctorId);

    await auditLogRepo.logAction({
      action: "DELETE_DOCTOR",
      entity: "Doctor",
      entityId: doctorId,
      userId: adminId,
    });

    return true;
  }
}
