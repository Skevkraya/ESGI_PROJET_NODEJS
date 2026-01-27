import { Router } from "express";

import { registerDeviceController, pollStatus } from "../controllers/devices.controller.ts";


const devicesRouter = Router();

devicesRouter.get("/devices/me", pollStatus);
devicesRouter.post("/devices/register", registerDeviceController);

export default devicesRouter;
