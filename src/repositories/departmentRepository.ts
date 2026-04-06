import { Department } from "../generated/prisma/client";
import BaseRepository from "./baseRepository";

export default class DepartmentRepository extends BaseRepository<Department> {
  constructor() {
    super("department");
  }

  async findByName(name: string): Promise<Department | null> {
    return this.findOne({ name });
  }

  async findActive(): Promise<Department[]> {
    return this.findAll({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
  }

  async findWithDoctors(departmentId: string): Promise<Department> {
    return this.findById(departmentId, {
      include: {
        doctors: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatarUrl: true },
            },
          },
        },
      },
    });
  }
}
