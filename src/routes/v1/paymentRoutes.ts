import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import { authorize } from "../../middlewares/rbacMiddleware";
import { heavyLimiter } from "../../middlewares/rateLimitMiddleware";
import {
  webhookHandler,
  createOrder,
  verifyPayment,
  getPaymentByAppointment,
  listPayments,
} from "../../controllers/paymentController";
import validate from "../../middlewares/validateMiddleware";
import {
  createPaymentOrderSchema,
  verifyPaymentSchema,
} from "../../validators/paymentValidator";
import { uuidParamSchema } from "../../validators/commonValidator";

const paymentRouter = Router();

paymentRouter.post("/webhook", webhookHandler);

paymentRouter.use(authenticate);

paymentRouter.post(
  "/order",
  heavyLimiter,
  validate(createPaymentOrderSchema),
  createOrder,
);

paymentRouter.post("/verify", validate(verifyPaymentSchema), verifyPayment);
paymentRouter.get("/appointment/:appointmentId", getPaymentByAppointment);
paymentRouter.get("/", authorize("ADMIN"), listPayments);

export default paymentRouter;
