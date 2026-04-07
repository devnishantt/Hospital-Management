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
import validate from "../../middlewares/validateMiddleware";
import { uuidParamSchema } from "../../validators/commonValidator";
import {
  createScheduleSchema,
  updateDoctorSchema,
  updateScheduleSchema,
} from "../../validators/doctorValidator";

const doctorRouter = Router();

doctorRouter.get("/available", getAvailableDoctors);
doctorRouter.get("/search", searchDoctors);

doctorRouter.use(authenticate);

doctorRouter.get("/", listDoctors);
doctorRouter.get("/:id", validate(uuidParamSchema, "params"), getDoctor);

doctorRouter.post("/", authorize("ADMIN"), createDoctor);
doctorRouter.patch(
  "/:id",
  authorize("ADMIN", "DOCTOR"),
  validate(uuidParamSchema, "params"),
  validate(updateDoctorSchema),
  updateDoctor,
);
doctorRouter.delete(
  "/:id",
  authorize("ADMIN"),
  validate(uuidParamSchema, "params"),
  deleteDoctor,
);

doctorRouter.post(
  "/:id/schedules",
  authorize("DOCTOR"),
  validate(uuidParamSchema, "params"),
  validate(createScheduleSchema),
  createSchedule,
);
doctorRouter.get("/:id/schedules", getSchedules);
doctorRouter.patch(
  "/schedules/:scheduleId",
  authorize("DOCTOR"),
  validate(uuidParamSchema, "params"),
  validate(updateScheduleSchema),
  updateSchedule,
);
doctorRouter.delete(
  "/schedules/:scheduleId",
  authorize("DOCTOR"),
  deleteSchedule,
);

export default doctorRouter;
