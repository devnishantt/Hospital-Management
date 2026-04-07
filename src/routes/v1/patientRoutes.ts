import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import { authorize } from "../../middlewares/rbacMiddleware";
import {
  createPatient,
  deletePatient,
  getMyPatientProfile,
  getPatient,
  listPatients,
  updatePatient,
} from "../../controllers/patientController";
import {
  createPatientSchema,
  updatePatientSchema,
} from "../../validators/patientValidator";
import validate from "../../middlewares/validateMiddleware";
import { uuidParamSchema } from "../../validators/commonValidator";

const patientRouter = Router();

patientRouter.use(authenticate);

patientRouter.post("/", validate(createPatientSchema), createPatient);
patientRouter.get("/me", getMyPatientProfile);
patientRouter.get("/:id", validate(uuidParamSchema, "params"), getPatient);
patientRouter.patch(
  "/:id",
  validate(uuidParamSchema, "params"),
  validate(updatePatientSchema),
  updatePatient,
);
patientRouter.get("/", authorize("ADMIN", "DOCTOR"), listPatients);
patientRouter.delete(
  "/:id",
  authorize("ADMIN"),
  validate(uuidParamSchema, "params"),
  deletePatient,
);

export default patientRouter;
