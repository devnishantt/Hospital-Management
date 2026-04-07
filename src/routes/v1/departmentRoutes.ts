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
import validate from "../../middlewares/validateMiddleware";
import { uuidParamSchema } from "../../validators/commonValidator";
import {
  createDepartmentSchema,
  updateDepartmentSchema,
} from "../../validators/departmentValidator";

const departmentRouter = Router();

departmentRouter.get("/active", getActiveDepartments);

departmentRouter.use(authenticate);

departmentRouter.get("/", listDepartments);
departmentRouter.get(
  "/:id",
  validate(uuidParamSchema, "params"),
  getDepartment,
);

departmentRouter.post(
  "/",
  authorize("ADMIN"),
  validate(createDepartmentSchema),
  createDepartment,
);
departmentRouter.patch(
  "/:id",
  authorize("ADMIN"),
  validate(uuidParamSchema, "params"),
  validate(updateDepartmentSchema),
  updateDepartment,
);
departmentRouter.delete(
  "/:id",
  authorize("ADMIN"),
  validate(uuidParamSchema, "params"),
  deleteDepartment,
);

export default departmentRouter;
