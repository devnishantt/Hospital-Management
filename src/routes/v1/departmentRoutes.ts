import { Router } from "express";
import {
  createDepartment,
  deleteDepartment,
  getActiveDepartments,
  getDepartment,
  listDepartments,
  updateDepartment,
} from "../../controllers/departmentController";
import { authenticate } from "../../middlewares/authMiddleware";
import { authorize } from "../../middlewares/rbacMiddleware";

const departmentRouter = Router();

departmentRouter.get("/active", getActiveDepartments);

departmentRouter.use(authenticate);

departmentRouter.get("/", listDepartments);
departmentRouter.get("/:id", getDepartment);

departmentRouter.post("/", authorize("ADMIN"), createDepartment);
departmentRouter.patch("/:id", authorize("ADMIN"), updateDepartment);
departmentRouter.delete("/:id", authorize("ADMIN"), deleteDepartment);

export default departmentRouter;
