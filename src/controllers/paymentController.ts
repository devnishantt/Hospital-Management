import { Request, Response } from "express";
import { asyncHandler } from "../utils/common/asyncHandler";
import { sendSuccess } from "../utils/common/response";
import { STATUS_CODES } from "../utils/common/constants";
import { parsePagination } from "../utils/common/pagination";
import PaymentService from "../services/paymentService";

const paymentService = new PaymentService();

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await paymentService.createOrder(req.user!.id, req.body);
  sendSuccess(res, order, "Payment order created", STATUS_CODES.CREATED);
});

export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const payment = await paymentService.verifyPayment(req.user!.id, req.body);
  sendSuccess(res, payment, "Payment verified", STATUS_CODES.OK);
});

export const webhookHandler = asyncHandler(async (req: Request, res: Response) => {
  const signature = req.headers["x-razorpay-signature"] as string;
  const result = await paymentService.handleWebhook(req.body, signature);
  sendSuccess(res, result, "Webhook processed", STATUS_CODES.OK);
});

export const getPaymentByAppointment = asyncHandler(async (req: Request, res: Response) => {
  const payment = await paymentService.getPaymentByAppointment(req.params.appointmentId as string);
  sendSuccess(res, payment, "Payment fetched", STATUS_CODES.OK);
});

export const listPayments = asyncHandler(async (req: Request, res: Response) => {
  const params = parsePagination(req.query);
  const filters = { status: req.query.status as string };
  const payments = await paymentService.listPayments(params, filters);
  sendSuccess(res, payments, "Payments fetched", STATUS_CODES.OK);
});
