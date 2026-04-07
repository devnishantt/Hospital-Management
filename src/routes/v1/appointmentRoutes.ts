import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import {
  bookAppointment,
  cancelAppointment,
  getAppointment,
  getByDoctor,
  getMyAppointments,
  listAppointments,
  reschedule,
  updateStatus,
} from "../../controllers/appointmentController";
import { authorize } from "../../middlewares/rbacMiddleware";
import validate from "../../middlewares/validateMiddleware";
import {
  createAppointmentSchema,
  rescheduleAppointmentSchema,
  updateAppointmentStatusSchema,
} from "../../validators/appointmentValidator";
import { uuidParamSchema } from "../../validators/commonValidator";

const appointmentRouter = Router();

appointmentRouter.use(authenticate);

appointmentRouter.post("/", validate(createAppointmentSchema), bookAppointment);
appointmentRouter.get("/me", getMyAppointments);
appointmentRouter.get(
  "/:id",
  validate(uuidParamSchema, "params"),
  getAppointment,
);
appointmentRouter.patch(
  "/:id/status",
  authorize("ADMIN", "DOCTOR"),
  validate(uuidParamSchema, "params"),
  validate(updateAppointmentStatusSchema),
  updateStatus,
);
appointmentRouter.patch(
  "/:id/reschedule",
  validate(uuidParamSchema, "params"),
  validate(rescheduleAppointmentSchema),
  reschedule,
);
appointmentRouter.patch(
  "/:id/cancel",
  validate(uuidParamSchema, "params"),
  cancelAppointment,
);
appointmentRouter.get(
  "/doctor/:doctorId",
  authorize("ADMIN", "DOCTOR"),
  getByDoctor,
);
appointmentRouter.get("/", authorize("ADMIN"), listAppointments);

export default appointmentRouter;
