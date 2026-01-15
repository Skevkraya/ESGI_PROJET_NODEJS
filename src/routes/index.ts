import { Router } from "express";
import pingRoutes from "../ping/ping.routes.ts";

const router = Router();

router.use(pingRoutes);

export default router;
