import { Router } from "express";

import { getAllDevices, approveDevice } from "../controllers/admin.controller.ts";


const adminRouter = Router();

adminRouter.get("/devices", getAllDevices);
adminRouter.post("/devices/:id/approve", approveDevice);


export default adminRouter;
