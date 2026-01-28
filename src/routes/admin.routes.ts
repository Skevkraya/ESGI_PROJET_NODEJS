import { Router } from "express";

import { getAllDevices } from "../controllers/admin.controller.ts";


const adminRouter = Router();

adminRouter.get("/devices", getAllDevices);

export default adminRouter;
