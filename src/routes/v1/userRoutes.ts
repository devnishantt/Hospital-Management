import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import {
  getProfile,
  listUsers,
  updateProfile,
  updateUserRole,
  updateUserStatus,
  uploadAvatar,
} from "../../controllers/userController";
import { uploadAvatar as uploadAvatarMiddleware } from "../../middlewares/uploadMiddleware";
import { authorize } from "../../middlewares/rbacMiddleware";
import { uuidParamSchema } from "../../validators/commonValidator";
import validate from "../../middlewares/validateMiddleware";
import {
  updateProfileSchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
} from "../../validators/userValidator";

const userRouter = Router();

userRouter.use(authenticate);

userRouter.get("/me", getProfile);
userRouter.patch("/me", validate(updateProfileSchema), updateProfile);
userRouter.patch("/me/avatar", uploadAvatarMiddleware, uploadAvatar);

userRouter.get("/", authorize("ADMIN"), listUsers);
userRouter.patch(
  "/:id/role",
  authorize("ADMIN"),
  validate(uuidParamSchema, "params"),
  validate(updateUserRoleSchema),
  updateUserRole,
);
userRouter.patch(
  "/:id/status",
  authorize("ADMIN"),
  validate(uuidParamSchema, "params"),
  validate(updateUserStatusSchema),
  updateUserStatus,
);

export default userRouter;
