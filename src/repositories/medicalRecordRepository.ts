import { MedicalRecord } from "../generated/prisma/client";
import BaseRepository from "./baseRepository";

export default class MedicalRecordRepository extends BaseRepository<MedicalRecord> {
  constructor() {
    super("medicalRecord");
  }

  async findByPatient(patientId: string): Promise<MedicalRecord[]> {
    return this.findAll({
      where: { patientId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByPatientAndType(
    patientId: string,
    recordType: string,
  ): Promise<MedicalRecord[]> {
    return this.findAll({
      where: { patientId, recordType: recordType as any },
      orderBy: { createdAt: "desc" },
    });
  }
}
