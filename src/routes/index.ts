import { Router } from "express";
import pingRoutes from "../ping/ping.routes.ts";

const router = Router();

router.use(pingRoutes);

// const checkAdminApiKey = (req, res, next) => {
//     const adminApiKey = req.headers["x-admin-api-key"];
//     async (req, res=) => {
//         res.json({ok: true});
//     }
// }

export default router;
