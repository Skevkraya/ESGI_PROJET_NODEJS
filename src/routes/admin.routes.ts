import { Router } from "express";

import {
  getAllDevices,
  approveDevice,
  getDeviceById,
  revokedDevice,
  lastMesure
} from "../controllers/admin.controller.ts";

const adminRouter = Router();

//il faut utiliser checkAdminApiKey
adminRouter.get("/devices", getAllDevices);
adminRouter.post("/devices/:id/approve", approveDevice);
//
adminRouter.get("/devices/:devId", getDeviceById);
adminRouter.post("/devices/:devId/revoke", revokedDevice);
adminRouter.get("/devices/:id/telemetry/latest",lastMesure);

export default adminRouter;
