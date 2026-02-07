import { Router } from "express";
import { sendTelemetry } from "../controllers/telemetry.controller.ts";

const telemetryRouter = Router();

telemetryRouter.post("/telemetry", sendTelemetry);

export default telemetryRouter;
