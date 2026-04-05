import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import {
  getProfile,
  listUsers,
  updateProfile,
  uploadAvatar,
} from "../../controllers/userController";
import { uploadAvatar as uploadAvatarMiddleware } from "../../middlewares/uploadMiddleware";
import { authorize } from "../../middlewares/rbacMiddleware";

const userRouter = Router();

userRouter.use(authenticate);

userRouter.get("/me", getProfile);
userRouter.patch("/me", updateProfile);
userRouter.patch("/me/avatar", uploadAvatarMiddleware, uploadAvatar);

userRouter.get("/", authorize("ADMIN"), listUsers);

export default userRouter;
