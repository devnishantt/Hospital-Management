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

const patientRouter = Router();

patientRouter.use(authenticate);

patientRouter.post("/", createPatient);
patientRouter.get("/me", getMyPatientProfile);
patientRouter.get("/:id", getPatient);
patientRouter.patch("/:id", updatePatient);
patientRouter.get("/", authorize("ADMIN", "DOCTOR"), listPatients);
patientRouter.delete("/:id", authorize("ADMIN"), deletePatient);

export default patientRouter;
