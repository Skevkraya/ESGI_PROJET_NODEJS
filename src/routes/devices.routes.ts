import { Router } from "express";
import { registerDeviceController, pollStatus } from "../controllers/devices.controller.ts";

const devicesRouter = Router();

devicesRouter.get("/me", pollStatus);
devicesRouter.post("/register", registerDeviceController);

export default devicesRouter;
