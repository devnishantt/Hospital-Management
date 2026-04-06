import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import { authorize } from "../../middlewares/rbacMiddleware";
import { heavyLimiter } from "../../middlewares/rateLimitMiddleware";
import { webhookHandler, createOrder, verifyPayment, getPaymentByAppointment, listPayments } from "../../controllers/paymentController";

const paymentRouter = Router();

paymentRouter.post("/webhook", webhookHandler);

paymentRouter.use(authenticate);

paymentRouter.post(
  "/order",
  heavyLimiter,
  createOrder,
);

paymentRouter.post(
  "/verify",
  verifyPayment,
);
paymentRouter.get(
  "/appointment/:appointmentId",
  getPaymentByAppointment,
);
paymentRouter.get("/", authorize("ADMIN"), listPayments);

export default paymentRouter;
