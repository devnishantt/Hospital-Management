import { Request, Response } from "express";
import { asyncHandler } from "../utils/common/asyncHandler";
import { sendSuccess } from "../utils/common/response";
import { STATUS_CODES } from "../utils/common/constants";
import { parsePagination } from "../utils/common/pagination";
import DepartmentService from "../services/departmentService";

const departmentService = new DepartmentService();

export const createDepartment = asyncHandler(
  async (req: Request, res: Response) => {
    const department = await departmentService.createDepartment(
      req.user!.id,
      req.body,
    );
    sendSuccess(res, department, "Department created", STATUS_CODES.CREATED);
  },
);

export const getDepartment = asyncHandler(
  async (req: Request, res: Response) => {
    const department = await departmentService.getDepartment(req.params.id as string);
    sendSuccess(res, department, "Department fetched", STATUS_CODES.OK);
  },
);

export const listDepartments = asyncHandler(
  async (req: Request, res: Response) => {
    const params = parsePagination(req.query);
    const departments = await departmentService.listDepartments(params);
    sendSuccess(res, departments, "Departments fetched", STATUS_CODES.OK);
  },
);

export const getActiveDepartments = asyncHandler(
  async (_req: Request, res: Response) => {
    const departments = await departmentService.getActiveDepartments();
    sendSuccess(
      res,
      departments,
      "Active departments fetched",
      STATUS_CODES.OK,
    );
  },
);

export const updateDepartment = asyncHandler(
  async (req: Request, res: Response) => {
    const department = await departmentService.updateDepartment(
      req.params.id as string,
      req.user!.id,
      req.body,
    );
    sendSuccess(res, department, "Department updated", STATUS_CODES.OK);
  },
);

export const deleteDepartment = asyncHandler(
  async (req: Request, res: Response) => {
    await departmentService.deleteDepartment(req.params.id as string, req.user!.id);
    sendSuccess(res, null, "Department deleted", STATUS_CODES.OK);
  },
);
