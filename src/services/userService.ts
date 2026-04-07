import AuditLogRepository from "../repositories/auditLogRepository";
import UserRepository from "../repositories/userRepository";
import { PaginationParams } from "../types";
import { ForbiddenError } from "../utils/errors/error";
import { uploadToCloudinary } from "../utils/helpers/cloudinary";

const userRepo = new UserRepository();
const auditLogRepo = new AuditLogRepository();

export default class UserService {
  async getProfile(userId: string) {
    const user = await userRepo.findById(userId, {
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        gender: true,
        role: true,
        avatarUrl: true,
        isActive: true,
        isTotpEnabled: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        patient: true,
        doctor: {
          include: {
            department: { select: { id: true, name: true } },
            doctorSchedules: { where: { isActive: true } },
          },
        },
      },
    });
    return user;
  }

  async updateProfile(
    userId: string,
    data: { name?: string; phone?: string; gender?: string },
  ) {
    const user = await userRepo.update(userId, data);
    const {
      password: _,
      refreshToken: __,
      totpSecret: ___,
      ...safeUser
    } = user;
    return safeUser;
  }

  async uploadAvatar(userId: string, fileBuffer: Buffer) {
    const result = await uploadToCloudinary(
      fileBuffer,
      "avatars",
      `user-${userId}`,
    );
    await userRepo.updateAvatar(userId, result.secure_url);
    return { avatarUrl: result.secure_url };
  }

  async listUsers(
    params: PaginationParams,
    filters: { role?: string; isActive?: boolean } = {},
  ) {
    const where: any = {};
    if (filters.role) where.role = filters.role;
    if (filters.isActive !== undefined) where.isActive = filters.isActive;

    return userRepo.findWithPagination(params, where, {
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        gender: true,
        role: true,
        avatarUrl: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
      },
    });
  }

  async updateUserRole(adminId: string, targetUserId: string, role: string) {
    if (adminId === targetUserId) {
      throw new ForbiddenError("Cannot change your own role.");
    }

    const user = await userRepo.update(targetUserId, { role });

    await auditLogRepo.logAction({
      action: "UPDATE_ROLE",
      entity: "User",
      entityId: targetUserId,
      userId: adminId,
      details: { newRole: role },
    });

    const {
      password: _,
      refreshToken: __,
      totpSecret: ___,
      ...safeUser
    } = user;
    return safeUser;
  }

  async updateUserStatus(
    adminId: string,
    targetUserId: string,
    isActive: boolean,
  ) {
    if (adminId === targetUserId) {
      throw new ForbiddenError("Cannot deactivate your own account.");
    }

    const user = isActive
      ? await userRepo.activateUser(targetUserId)
      : await userRepo.deactivateUser(targetUserId);

    await auditLogRepo.logAction({
      action: isActive ? "ACTIVATE_USER" : "DEACTIVATE_USER",
      entity: "User",
      entityId: targetUserId,
      userId: adminId,
    });

    const {
      password: _,
      refreshToken: __,
      totpSecret: ___,
      ...safeUser
    } = user;
    return safeUser;
  }
}

