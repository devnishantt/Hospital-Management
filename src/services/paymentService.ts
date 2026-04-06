import crypto from "crypto";
import razorpay from "../config/razorpayConfig";
import {
  RAZORPAY_KEY_SECRET,
  RAZORPAY_WEBHOOK_SECRET,
} from "../config/envConfig";
import PaymentRepository from "../repositories/paymentRepository";
import AppointmentRepository from "../repositories/appointmentRepository";
import AuditLogRepository from "../repositories/auditLogRepository";
import NotificationRepository from "../repositories/notificationRepository";
import { ValidationError, NotFoundError } from "../utils/errors/error";
import { sendPaymentReceiptEmail } from "../utils/helpers/email";
import logger from "../config/loggerConfig";

const paymentRepo = new PaymentRepository();
const appointmentRepo = new AppointmentRepository();
const auditLogRepo = new AuditLogRepository();
const notifRepo = new NotificationRepository();

export default class PaymentService {
  async createOrder(
    userId: string,
    data: { appointmentId: string; amount: number; currency?: string },
  ) {
    const appointment = await appointmentRepo.findById(data.appointmentId);

    const existingPayment = await paymentRepo.findByAppointment(
      data.appointmentId,
    );
    if (existingPayment && existingPayment.status === "PAID") {
      throw new ValidationError(
        "Payment has already been completed for this appointment.",
      );
    }

    const order = await razorpay.orders.create({
      amount: Math.round(data.amount * 100),
      currency: data.currency || "INR",
      receipt: `appt_${data.appointmentId}`,
      notes: {
        appointmentId: data.appointmentId,
        userId,
      },
    });

    let payment;
    if (existingPayment) {
      payment = await paymentRepo.update(existingPayment.id, {
        amount: data.amount,
        currency: data.currency || "INR",
        razorpayOrderId: order.id,
        status: "PENDING",
      });
    } else {
      payment = await paymentRepo.create({
        amount: data.amount,
        currency: data.currency || "INR",
        razorpayOrderId: order.id,
        appointmentId: data.appointmentId,
        status: "PENDING",
      });
    }

    await auditLogRepo.logAction({
      action: "CREATE_PAYMENT_ORDER",
      entity: "Payment",
      entityId: payment.id,
      userId,
      details: { razorpayOrderId: order.id, amount: data.amount },
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      paymentId: payment.id,
    };
  }

  async verifyPayment(
    userId: string,
    data: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    },
  ) {
    const body = `${data.razorpay_order_id}|${data.razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== data.razorpay_signature) {
      throw new ValidationError(
        "Payment verification failed. Invalid signature.",
      );
    }

    const payment = await paymentRepo.findByRazorpayOrderId(
      data.razorpay_order_id,
    );
    if (!payment) {
      throw new NotFoundError("Payment order not found.");
    }

    const updated = await paymentRepo.updatePaymentStatus(payment.id, "PAID", {
      razorpayPaymentId: data.razorpay_payment_id,
      transactionId: data.razorpay_payment_id,
    });

    await appointmentRepo.update(payment.appointmentId, {
      status: "CONFIRMED",
    });

    await notifRepo.create({
      title: "Payment Successful",
      message: `Payment of ₹${payment.amount} received successfully.`,
      type: "PAYMENT",
      userId,
    });

    sendPaymentReceiptEmail(
      "",
      "",
      payment.amount,
      data.razorpay_payment_id,
      new Date().toDateString(),
    ).catch(() => {});

    await auditLogRepo.logAction({
      action: "VERIFY_PAYMENT",
      entity: "Payment",
      entityId: payment.id,
      userId,
      details: { razorpayPaymentId: data.razorpay_payment_id },
    });

    return updated;
  }

  async handleWebhook(body: any, signature: string) {
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
      .update(JSON.stringify(body))
      .digest("hex");

    if (expectedSignature !== signature) {
      logger.warn("Invalid Razorpay webhook signature");
      throw new ValidationError("Invalid webhook signature.");
    }

    const event = body.event;
    const payloadEntity = body.payload?.payment?.entity;

    if (event === "payment.captured" && payloadEntity) {
      const payment = await paymentRepo.findByRazorpayOrderId(
        payloadEntity.order_id,
      );
      if (payment && payment.status !== "PAID") {
        await paymentRepo.updatePaymentStatus(payment.id, "PAID", {
          razorpayPaymentId: payloadEntity.id,
          transactionId: payloadEntity.id,
          paymentMethod: payloadEntity.method,
        });
        logger.info(`Webhook: Payment ${payment.id} marked as PAID`);
      }
    }

    if (event === "payment.failed" && payloadEntity) {
      const payment = await paymentRepo.findByRazorpayOrderId(
        payloadEntity.order_id,
      );
      if (payment) {
        await paymentRepo.updatePaymentStatus(payment.id, "FAILED");
        logger.info(`Webhook: Payment ${payment.id} marked as FAILED`);
      }
    }

    return { received: true };
  }

  async getPaymentByAppointment(appointmentId: string) {
    return paymentRepo.findByAppointment(appointmentId);
  }

  async listPayments(params: any, filters: { status?: string } = {}) {
    const where: any = {};
    if (filters.status) where.status = filters.status;

    return paymentRepo.findWithPagination(params, where, {
      include: {
        appointment: {
          include: {
            patient: {
              include: {
                user: { select: { id: true, name: true, email: true } },
              },
            },
            doctor: { include: { user: { select: { id: true, name: true } } } },
          },
        },
      },
    });
  }
}
