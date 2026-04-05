import PatientRepository from "../repositories/patientRepository";
import UserRepository from "../repositories/userRepository";
import AuditLogRepository from "../repositories/auditLogRepository";
import {
  NotFoundError,
  ConflictError,
  ForbiddenError,
} from "../utils/errors/error";
import type { PaginationParams } from "../types";

const patientRepo = new PatientRepository();
const userRepo = new UserRepository();
const auditLogRepo = new AuditLogRepository();

export default class PatientService {
  async createPatient(userId: string, data: any) {
    const existing = await patientRepo.findByUserId(userId);
    if (existing) {
      throw new ConflictError("Patient profile already exists for this user.");
    }

    const patient = await patientRepo.create({ ...data, userId });

    await auditLogRepo.logAction({
      action: "CREATE_PATIENT",
      entity: "Patient",
      entityId: patient.id,
      userId,
    });

    return patient;
  }

  async getPatient(patientId: string) {
    return patientRepo.findWithUser(patientId);
  }

  async getPatientByUserId(userId: string) {
    const patient = await patientRepo.findByUserId(userId);
    if (!patient) {
      throw new NotFoundError("Patient profile not found.");
    }
    return patient;
  }

  async updatePatient(
    patientId: string,
    userId: string,
    role: string,
    data: any,
  ) {
    const patient = await patientRepo.findById(patientId);

    if (role !== "ADMIN" && patient.userId !== userId) {
      throw new ForbiddenError("You can only update your own patient profile.");
    }

    const updated = await patientRepo.update(patientId, data);

    await auditLogRepo.logAction({
      action: "UPDATE_PATIENT",
      entity: "Patient",
      entityId: patientId,
      userId,
    });

    return updated;
  }

  async listPatients(params: PaginationParams) {
    return patientRepo.findWithPagination(
      params,
      {},
      {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              gender: true,
            },
          },
        },
      },
    );
  }

  async deletePatient(patientId: string, adminId: string) {
    await patientRepo.delete(patientId);

    await auditLogRepo.logAction({
      action: "DELETE_PATIENT",
      entity: "Patient",
      entityId: patientId,
      userId: adminId,
    });

    return true;
  }
}
