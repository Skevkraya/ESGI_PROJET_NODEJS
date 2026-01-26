import { Router } from "express";

import { registerDeviceController } from "../controllers/devices.controller.ts";


const devicesRouter = Router();

devicesRouter.post("/devices/register", registerDeviceController);

export default devicesRouter;
