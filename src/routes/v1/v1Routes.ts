import { Router } from "express";
import authRouter from "./authRoutes";
import userRouter from "./userRoutes";
import patientRouter from "./patientRoutes";

const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use("/users", userRouter);
v1Router.use("/patients", patientRouter);

export default v1Router;
