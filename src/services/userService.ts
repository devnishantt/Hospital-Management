import AuditLogRepository from "../repositories/auditLogRepository";
import UserRepository from "../repositories/userRepository";
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
}
