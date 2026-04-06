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

const appointmentRouter = Router();

appointmentRouter.use(authenticate);

appointmentRouter.post("/", bookAppointment);
appointmentRouter.get("/me", getMyAppointments);
appointmentRouter.get("/:id", getAppointment);
appointmentRouter.patch(
  "/:id/status",
  authorize("ADMIN", "DOCTOR"),
  updateStatus,
);
appointmentRouter.patch("/:id/reschedule", reschedule);
appointmentRouter.patch("/:id/cancel", cancelAppointment);
appointmentRouter.get(
  "/doctor/:doctorId",
  authorize("ADMIN", "DOCTOR"),
  getByDoctor,
);
appointmentRouter.get("/", authorize("ADMIN"), listAppointments);

export default appointmentRouter;
