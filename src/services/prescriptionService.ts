import PrescriptionRepository from "../repositories/prescriptionRepository";
import AppointmentRepository from "../repositories/appointmentRepository";
import AuditLogRepository from "../repositories/auditLogRepository";
import { ForbiddenError, ValidationError } from "../utils/errors/error";

const prescriptionRepo = new PrescriptionRepository();
const appointmentRepo = new AppointmentRepository();
const auditLogRepo = new AuditLogRepository();

export default class PrescriptionService {
  async createPrescription(userId: string, data: any) {
    const appointment = await appointmentRepo.findWithDetails(data.appointmentId);

    if ((appointment as any).doctor?.userId !== userId) {
      throw new ForbiddenError("You can only prescribe for your own appointments.");
    }

    if (appointment.status === "CANCELLED") {
      throw new ValidationError("Cannot prescribe for a cancelled appointment.");
    }

    const prescription = await prescriptionRepo.create(data);

    await auditLogRepo.logAction({
      action: "CREATE_PRESCRIPTION",
      entity: "Prescription",
      entityId: prescription.id,
      userId,
    });

    return prescription;
  }

  async getPrescription(prescriptionId: string) {
    return prescriptionRepo.findById(prescriptionId);
  }

  async getByAppointment(appointmentId: string) {
    return prescriptionRepo.findByAppointment(appointmentId);
  }

  async updatePrescription(prescriptionId: string, userId: string, data: any) {
    const prescription = await prescriptionRepo.findById(prescriptionId);
    const appointment = await appointmentRepo.findWithDetails(prescription.appointmentId);

    if ((appointment as any).doctor?.userId !== userId) {
      throw new ForbiddenError("You can only update your own prescriptions.");
    }

    const updated = await prescriptionRepo.update(prescriptionId, data);

    await auditLogRepo.logAction({
      action: "UPDATE_PRESCRIPTION",
      entity: "Prescription",
      entityId: prescriptionId,
      userId,
    });

    return updated;
  }

  async deletePrescription(prescriptionId: string, userId: string) {
    const prescription = await prescriptionRepo.findById(prescriptionId);
    const appointment = await appointmentRepo.findWithDetails(prescription.appointmentId);

    if ((appointment as any).doctor?.userId !== userId) {
      throw new ForbiddenError("You can only delete your own prescriptions.");
    }

    await prescriptionRepo.delete(prescriptionId);

    await auditLogRepo.logAction({
      action: "DELETE_PRESCRIPTION",
      entity: "Prescription",
      entityId: prescriptionId,
      userId,
    });

    return true;
  }
}
