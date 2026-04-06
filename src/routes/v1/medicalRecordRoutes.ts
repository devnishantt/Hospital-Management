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

const medicalRecordRouter = Router();

medicalRecordRouter.use(authenticate);

medicalRecordRouter.post("/", authorize("ADMIN", "DOCTOR"), createRecord);
medicalRecordRouter.get("/:id", getRecord);
medicalRecordRouter.get("/patient/:patientId", getByPatient);
medicalRecordRouter.patch("/:id", authorize("ADMIN", "DOCTOR"), updateRecord);
medicalRecordRouter.delete("/:id", authorize("ADMIN"), deleteRecord);
medicalRecordRouter.get("/", authorize("ADMIN", "DOCTOR"), listRecords);

export default medicalRecordRouter;
