import { z } from "zod";

export const createPaymentOrderSchema = z.object({
  appointmentId: z.uuid("Invalid appointment ID"),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().length(3).optional().default("INR"),
});

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export const refundPaymentSchema = z.object({
  paymentId: z.uuid("Invalid payment ID"),
  reason: z.string().max(500).optional(),
});
