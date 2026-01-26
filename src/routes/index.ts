import { Router } from "express";
import pingRoutes from "../ping/ping.routes.ts";
import devicesRoutes from "./devices.routes.ts";

const router = Router();

router.use(pingRoutes);
router.use(devicesRoutes);

// const checkAdminApiKey = (req, res, next) => {
//     const adminApiKey = req.headers["x-admin-api-key"];
//     async (req, res=) => {
//         res.json({ok: true});
//     }
// }

export default router;
