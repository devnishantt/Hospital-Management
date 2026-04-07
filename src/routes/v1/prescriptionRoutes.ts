import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import { authorize } from "../../middlewares/rbacMiddleware";
import {
  createPrescription,
  deletePrescription,
  getByAppointment,
  getPrescription,
  updatePrescription,
} from "../../controllers/prescriptionController";
import validate from "../../middlewares/validateMiddleware";
import {
  createPrescriptionSchema,
  updatePrescriptionSchema,
} from "../../validators/prescriptionValidator";
import { uuidParamSchema } from "../../validators/commonValidator";

const prescriptionRouter = Router();

prescriptionRouter.use(authenticate);

prescriptionRouter.post(
  "/",
  authorize("DOCTOR"),
  validate(createPrescriptionSchema),
  createPrescription,
);
prescriptionRouter.get(
  "/:id",
  validate(uuidParamSchema, "params"),
  getPrescription,
);
prescriptionRouter.get("/appointment/:appointmentId", getByAppointment);
prescriptionRouter.patch(
  "/:id",
  authorize("DOCTOR"),
  validate(uuidParamSchema, "params"),
  validate(updatePrescriptionSchema),
  updatePrescription,
);
prescriptionRouter.delete(
  "/:id",
  authorize("DOCTOR"),
  validate(uuidParamSchema, "params"),
  deletePrescription,
);

export default prescriptionRouter;
