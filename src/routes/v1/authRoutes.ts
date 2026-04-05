import { Router } from "express";
import {
  changePassword,
  disableTotp,
  enableTotp,
  login,
  logout,
  refreshToken,
  register,
  verifyTotp,
} from "../../controllers/authController";
import { authenticate } from "../../middlewares/authMiddleware";
import { authLimiter } from "../../middlewares/rateLimitMiddleware";

const authRouter = Router();

authRouter.post("/register", authLimiter, register);
authRouter.post("/login", authLimiter, login);
authRouter.post("/refresh-token", refreshToken);

authRouter.post("/logout", authenticate, logout);
authRouter.post("/change-password", authenticate, changePassword);

authRouter.post("/totp/enable", authenticate, enableTotp);
authRouter.post("/totp/verify", authenticate, verifyTotp);
authRouter.post("/totp/disable", authenticate, disableTotp);

export default authRouter;
