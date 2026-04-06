import DepartmentRepository from "../repositories/departmentRepository";
import AuditLogRepository from "../repositories/auditLogRepository";
import type { PaginationParams } from "../types";

const departmentRepo = new DepartmentRepository();
const auditLogRepo = new AuditLogRepository();

export default class DepartmentService {
  async createDepartment(
    userId: string,
    data: { name: string; description?: string },
  ) {
    const department = await departmentRepo.create(data);

    await auditLogRepo.logAction({
      action: "CREATE_DEPARTMENT",
      entity: "Department",
      entityId: department.id,
      userId,
    });

    return department;
  }

  async getDepartment(departmentId: string) {
    return departmentRepo.findWithDoctors(departmentId);
  }

  async listDepartments(params: PaginationParams) {
    return departmentRepo.findWithPagination(params, { isActive: true });
  }

  async getActiveDepartments() {
    return departmentRepo.findActive();
  }

  async updateDepartment(departmentId: string, userId: string, data: any) {
    const updated = await departmentRepo.update(departmentId, data);

    await auditLogRepo.logAction({
      action: "UPDATE_DEPARTMENT",
      entity: "Department",
      entityId: departmentId,
      userId,
    });

    return updated;
  }

  async deleteDepartment(departmentId: string, userId: string) {
    await departmentRepo.delete(departmentId);

    await auditLogRepo.logAction({
      action: "DELETE_DEPARTMENT",
      entity: "Department",
      entityId: departmentId,
      userId,
    });

    return true;
  }
}
