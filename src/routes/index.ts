import { Router } from "express";
import pingRoutes from "./ping.routes.ts";
import devicesRoutes from "./devices.routes.ts";
import adminRoutes from "./admin.routes.ts";
import telemetryRoutes from "./telemetry.routes.ts";
import { checkAdminApiKey } from "../middlewares/checkAdminRights.ts";

const router = Router();

router.use(pingRoutes);
router.use(telemetryRoutes);
router.use("/devices", devicesRoutes);
router.use("/admin", adminRoutes);



export default router;
