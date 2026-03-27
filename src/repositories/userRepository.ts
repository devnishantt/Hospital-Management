import { User, UserRoles } from "../generated/prisma/client";
import BaseRepository from "./baseRepository";

interface safeUser {
  id: string;
  email: string;
  role: UserRoles;
  phone?: string;
  gender: string;
  isActive: boolean;
  lastLogin: Date;
}

export default class UserRepository extends BaseRepository<User> {
  constructor() {
    super("User");
  }

  async findByEmail(email: string, options: any = {}): Promise<User | null> {
    return await this.findOne({ email }, options);
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<User> {
    return await this.update(userId, { refreshToken });
  }

  async updateLastLogin(userId: string): Promise<User> {
    return await this.update(userId, { lastLogin: new Date() });
  }

  async updateTotpSecret(
    userId: string,
    totpSecret: string | null,
    isTotpEnabled: boolean,
  ): Promise<User> {
    return await this.update(userId, { totpSecret, isTotpEnabled });
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<User> {
    return await this.update(userId, { avatarUrl });
  }

  async deactivateUser(userId: string): Promise<User> {
    return await this.update(userId, { isActive: false });
  }

  async activateUser(userId: string): Promise<User> {
    return await this.update(userId, { isActive: true });
  }
}
