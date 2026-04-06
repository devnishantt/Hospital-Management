import { Router } from "express";
import {
  createDoctor,
  createSchedule,
  deleteDoctor,
  deleteSchedule,
  getAvailableDoctors,
  getDoctor,
  getSchedules,
  listDoctors,
  searchDoctors,
  updateDoctor,
  updateSchedule,
} from "../../controllers/doctorController";
import { authenticate } from "../../middlewares/authMiddleware";
import { authorize } from "../../middlewares/rbacMiddleware";

const doctorRouter = Router();

doctorRouter.get("/available", getAvailableDoctors);
doctorRouter.get("/search", searchDoctors);

doctorRouter.use(authenticate);

doctorRouter.get("/", listDoctors);
doctorRouter.get("/:id", getDoctor);

doctorRouter.post("/", authorize("ADMIN"), createDoctor);
doctorRouter.patch("/:id", authorize("ADMIN", "DOCTOR"), updateDoctor);
doctorRouter.delete("/:id", authorize("ADMIN"), deleteDoctor);

doctorRouter.post("/:id/schedules", authorize("DOCTOR"), createSchedule);
doctorRouter.get("/:id/schedules", getSchedules);
doctorRouter.patch(
  "/schedules/:scheduleId",
  authorize("DOCTOR"),
  updateSchedule,
);
doctorRouter.delete(
  "/schedules/:scheduleId",
  authorize("DOCTOR"),
  deleteSchedule,
);

export default doctorRouter