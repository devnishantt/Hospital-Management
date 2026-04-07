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
import validate from "../../middlewares/validateMiddleware";
import {
  changePasswordSchema,
  enableTotpSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  verifyTotpSchema,
} from "../../validators/authValidator";

const authRouter = Router();

authRouter.post("/register", authLimiter, validate(registerSchema), register);
authRouter.post("/login", authLimiter, validate(loginSchema), login);
authRouter.post("/refresh-token", validate(refreshTokenSchema), refreshToken);

authRouter.post("/logout", authenticate, logout);
authRouter.post(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  changePassword,
);

authRouter.post(
  "/totp/enable",
  authenticate,
  validate(enableTotpSchema),
  enableTotp,
);
authRouter.post(
  "/totp/verify",
  authenticate,
  validate(verifyTotpSchema),
  verifyTotp,
);
authRouter.post(
  "/totp/disable",
  authenticate,
  validate(enableTotpSchema),
  disableTotp,
);

export default authRouter;
