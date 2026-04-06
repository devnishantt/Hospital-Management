import { Notification } from "../generated/prisma/client";
import BaseRepository from "./baseRepository";

export default class NotificationRepository extends BaseRepository<Notification> {
  constructor() {
    super("notification");
  }

  async findByUser(userId: string): Promise<Notification[]> {
    return this.findAll({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findUnread(userId: string): Promise<Notification[]> {
    return this.findAll({
      where: { userId, isRead: false },
      orderBy: { createdAt: "desc" },
    });
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    return this.update(notificationId, { isRead: true, readAt: new Date() });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await (this.model as any).updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async countUnread(userId: string): Promise<number> {
    return this.count({ userId, isRead: false });
  }
}
