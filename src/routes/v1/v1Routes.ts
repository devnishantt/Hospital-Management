import { Router } from "express";
import authRouter from "./authRoutes";
import userRouter from "./userRoutes";
import patientRouter from "./patientRoutes";
import doctorRouter from "./doctorRoutes";
import departmentRouter from "./departmentRoutes";

const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use("/users", userRouter);
v1Router.use("/patients", patientRouter);
v1Router.use("/doctors", doctorRouter);

v1Router.use("/departments", departmentRouter);


export default v1Router;
