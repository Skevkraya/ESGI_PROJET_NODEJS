import { Router } from "express";

import {
  getAllDevices,
  approveDevice,
  getTelemetryById,
} from "../controllers/admin.controller.ts";

const adminRouter = Router();

adminRouter.get("/devices", getAllDevices);
adminRouter.post("/devices/:id/approve", approveDevice);
adminRouter.get("/devices/:id/telemetry", getTelemetryById);

export default adminRouter;
