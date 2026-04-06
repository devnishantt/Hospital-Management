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

const prescriptionRouter = Router();

prescriptionRouter.use(authenticate);

prescriptionRouter.post("/", authorize("DOCTOR"), createPrescription);
prescriptionRouter.get("/:id", getPrescription);
prescriptionRouter.get("/appointment/:appointmentId", getByAppointment);
prescriptionRouter.patch("/:id", authorize("DOCTOR"), updatePrescription);
prescriptionRouter.delete("/:id", authorize("DOCTOR"), deletePrescription);

export default prescriptionRouter;
