import { Router } from "express";
import { authorize } from "../../middlewares/rbacMiddleware";
import {
  createRecord,
  deleteRecord,
  getByPatient,
  getRecord,
  listRecords,
  updateRecord,
} from "../../controllers/medicalRecordController";
import { authenticate } from "../../middlewares/authMiddleware";
import {
  createMedicalRecordSchema,
  updateMedicalRecordSchema,
} from "../../validators/medicalRecordValidator";
import validate from "../../middlewares/validateMiddleware";
import { uuidParamSchema } from "../../validators/commonValidator";

const medicalRecordRouter = Router();

medicalRecordRouter.use(authenticate);

medicalRecordRouter.post(
  "/",
  authorize("ADMIN", "DOCTOR"),
  validate(createMedicalRecordSchema),
  createRecord,
);
medicalRecordRouter.get("/:id", validate(uuidParamSchema, "params"), getRecord);
medicalRecordRouter.get("/patient/:patientId", getByPatient);
medicalRecordRouter.patch(
  "/:id",
  authorize("ADMIN", "DOCTOR"),
  validate(uuidParamSchema, "params"),
  validate(updateMedicalRecordSchema),
  updateRecord,
);
medicalRecordRouter.delete(
  "/:id",
  authorize("ADMIN"),
  validate(uuidParamSchema, "params"),
  deleteRecord,
);
medicalRecordRouter.get("/", authorize("ADMIN", "DOCTOR"), listRecords);

export default medicalRecordRouter;
