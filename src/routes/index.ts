import { Router } from "express";
import pingRoutes from "./ping.routes.ts";
import devicesRoutes from "./devices.routes.ts";
import adminRoutes from "./admin.routes.ts"
import { checkAdminApiKey } from "../middlewares/checkAdminRights.ts";

const router = Router();

router.use(pingRoutes);
router.use("/devices", devicesRoutes);
router.use("/admin", adminRoutes, checkAdminApiKey);



export default router;
