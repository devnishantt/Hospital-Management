import NotificationRepository from "../repositories/notificationRepository";
import { sendMail } from "../utils/helpers/email";
import type { PaginationParams } from "../types";

const notifRepo = new NotificationRepository();

export default class NotificationService {
  async createNotification(data: {
    userId: string;
    title: string;
    message: string;
    type?: string;
  }) {
    return notifRepo.create({
      ...data,
      type: data.type || "SYSTEM",
    });
  }

  async getUserNotifications(userId: string) {
    return notifRepo.findByUser(userId);
  }

  async getUnreadNotifications(userId: string) {
    return notifRepo.findUnread(userId);
  }

  async getUnreadCount(userId: string) {
    return notifRepo.countUnread(userId);
  }

  async markAsRead(notificationId: string) {
    return notifRepo.markAsRead(notificationId);
  }

  async markAllAsRead(userId: string) {
    await notifRepo.markAllAsRead(userId);
    return { message: "All notifications marked as read." };
  }

  async deleteNotification(notificationId: string) {
    await notifRepo.delete(notificationId);
    return true;
  }

  async notifyWithEmail(data: {
    userId: string;
    email: string;
    title: string;
    message: string;
    type?: string;
  }) {
    const notif = await this.createNotification(data);

    await sendMail({
      to: data.email,
      subject: data.title,
      html: `<p>${data.message}</p>`,
    });

    return notif;
  }
}
