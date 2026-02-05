import { Router } from "express";

import {
  getAllDevices,
  approveDevice,
  getDeviceById,
  revokedDevice,
} from "../controllers/admin.controller.ts";

const adminRouter = Router();

//il faut utiliser checkAdminApiKey
adminRouter.get("/devices", getAllDevices);
adminRouter.post("/devices/:id/approve", approveDevice);
//it's me
adminRouter.get("/devices/:devId", getDeviceById);
adminRouter.post("/devices/:devId/revoke", revokedDevice);

export default adminRouter;
