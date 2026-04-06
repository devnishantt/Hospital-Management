import { Doctor } from "../generated/prisma/client";
import BaseRepository from "./baseRepository";

export default class DoctorRepository extends BaseRepository<Doctor> {
  constructor() {
    super("doctor");
  }

  async findByUserId(userId: string): Promise<Doctor | null> {
    return this.findOne({ userId });
  }

  async findBySpecialization(specialization: string): Promise<Doctor[]> {
    return this.findAll({
      where: {
        specialization: { contains: specialization, mode: "insensitive" },
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        department: { select: { id: true, name: true } },
      },
    });
  }

  async findAvailable(): Promise<Doctor[]> {
    return this.findAll({
      where: { isAvailable: true },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        department: { select: { id: true, name: true } },
        doctorSchedules: { where: { isActive: true } },
      },
    });
  }

  async findWithDetails(doctorId: string): Promise<Doctor> {
    return this.findById(doctorId, {
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
        department: { select: { id: true, name: true } },
        doctorSchedules: { where: { isActive: true } },
      },
    });
  }
}
