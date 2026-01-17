import { Router } from "express";

import { registerDeviceController } from "../controllers/devices.controller.ts";


export const devicesRouter = Router();

devicesRouter.get("/devices/register", registerDeviceController);
