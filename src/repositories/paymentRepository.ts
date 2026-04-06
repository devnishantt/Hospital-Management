import { Payment } from "../generated/prisma/client";
import BaseRepository from "./baseRepository";

export default class PaymentRepository extends BaseRepository<Payment> {
  constructor() {
    super("payment");
  }

  async findByRazorpayOrderId(razorpayOrderId: string): Promise<Payment | null> {
    return this.findOne({ razorpayOrderId });
  }

  async findByAppointment(appointmentId: string): Promise<Payment | null> {
    return this.findOne({ appointmentId });
  }

  async updatePaymentStatus(
    paymentId: string,
    status: string,
    extra: Record<string, any> = {},
  ): Promise<Payment> {
    return this.update(paymentId, {
      status,
      ...extra,
      ...(status === "PAID" ? { paidAt: new Date() } : {}),
    });
  }
}
