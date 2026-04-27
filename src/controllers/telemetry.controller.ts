import type { Request, Response } from "express";
import { telemetryRepository } from "../repositories/telemetry.repository.ts";
import {
  authenticateDevice,
  requireActive,
} from "../middlewares/authDevice.middleware.ts";
import {
  climateTelemetrySchema,
  presenceTelemetrySchema,
} from "../schemas/telemetry.schema.ts";

export const sendTelemetry = async (req: Request, res: Response) => {
  const authResult = await authenticateDevice(req);
  if (!authResult.success) {
    return res.status(authResult.status).json({ message: authResult.message });
  }

  const activeResult = requireActive(authResult.device);
  if (!activeResult.success) {
    return res
      .status(activeResult.status)
      .json({ message: activeResult.message });
  }

  const device = authResult.device;

  const schema =
    device.type === "climate"
      ? climateTelemetrySchema
      : presenceTelemetrySchema;
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res
      .status(400)
      .json({ message: "Bad Request", errors: result.error.issues });
  }

  try {
    await telemetryRepository.insert({
      deviceId: device.deviceId,
      timestamp: new Date(result.data.timestamp),
      ...(device.type === "climate" && {
        temperature: (result.data as { temperature: number }).temperature,
        humidity: (result.data as { humidity: number }).humidity,
      }),
      ...(device.type === "presence" && {
        motion: (result.data as { motion: boolean }).motion,
      }),
      battery: result.data.battery,
    });

    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error("Error sending telemetry:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
