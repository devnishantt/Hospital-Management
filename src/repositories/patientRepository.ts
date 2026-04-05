import { Patient } from "../generated/prisma/client";
import BaseRepository from "./baseRepository";

export default class PatientRepository extends BaseRepository<Patient> {
  constructor() {
    super("patient");
  }

  async findByUserId(userId: string): Promise<Patient | null> {
    return this.findOne({ userId });
  }

  async findWithUser(patientId: string): Promise<Patient> {
    return this.findById(patientId, {
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            gender: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async findAllWithUser(options: any = {}): Promise<Patient[]> {
    return this.findAll({
      ...options,
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
    });
  }
}
