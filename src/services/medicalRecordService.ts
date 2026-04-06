import MedicalRecordRepository from "../repositories/medicalRecordRepository";
import AuditLogRepository from "../repositories/auditLogRepository";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/helpers/cloudinary";
import type { PaginationParams } from "../types";

const recordRepo = new MedicalRecordRepository();
const auditLogRepo = new AuditLogRepository();

export default class MedicalRecordService {
  async createRecord(
    userId: string,
    data: {
      patientId: string;
      title: string;
      description?: string;
      recordType?: string;
    },
    fileBuffer?: Buffer,
  ) {
    let fileUrl: string | undefined;
    let filePublicId: string | undefined;

    if (fileBuffer) {
      const result = await uploadToCloudinary(fileBuffer, "medical-records");
      fileUrl = result.secure_url;
      filePublicId = result.public_id;
    }

    const record = await recordRepo.create({
      ...data,
      fileUrl,
      filePublicId,
    });

    await auditLogRepo.logAction({
      action: "CREATE_MEDICAL_RECORD",
      entity: "MedicalRecord",
      entityId: record.id,
      userId,
    });

    return record;
  }

  async getRecord(recordId: string) {
    return recordRepo.findById(recordId);
  }

  async getByPatient(patientId: string) {
    return recordRepo.findByPatient(patientId);
  }

  async getByPatientAndType(patientId: string, recordType: string) {
    return recordRepo.findByPatientAndType(patientId, recordType);
  }

  async updateRecord(
    recordId: string,
    userId: string,
    data: any,
    fileBuffer?: Buffer,
  ) {
    const record = await recordRepo.findById(recordId);

    if (fileBuffer) {
      if (record.filePublicId) {
        await deleteFromCloudinary(record.filePublicId);
      }

      const result = await uploadToCloudinary(fileBuffer, "medical-records");
      data.fileUrl = result.secure_url;
      data.filePublicId = result.public_id;
    }

    const updated = await recordRepo.update(recordId, data);

    await auditLogRepo.logAction({
      action: "UPDATE_MEDICAL_RECORD",
      entity: "MedicalRecord",
      entityId: recordId,
      userId,
    });

    return updated;
  }

  async deleteRecord(recordId: string, userId: string) {
    const record = await recordRepo.findById(recordId);

    if (record.filePublicId) {
      await deleteFromCloudinary(record.filePublicId);
    }

    await recordRepo.delete(recordId);

    await auditLogRepo.logAction({
      action: "DELETE_MEDICAL_RECORD",
      entity: "MedicalRecord",
      entityId: recordId,
      userId,
    });

    return true;
  }

  async listRecords(
    params: PaginationParams,
    filters: { patientId?: string; recordType?: string } = {},
  ) {
    const where: any = {};
    if (filters.patientId) where.patientId = filters.patientId;
    if (filters.recordType) where.recordType = filters.recordType;

    return recordRepo.findWithPagination(params, where);
  }
}
