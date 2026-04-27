import type { Request, Response } from "express";
import { z } from "zod";
import { telemetryRepository } from "../repositories/telemetry.repository.ts";
import {
  authenticateDevice,
  requireActive,
} from "../middlewares/authDevice.middleware.ts";

// Schéma de base commun
const baseTelemetrySchema = z.object({
  timestamp: z.iso.datetime(),
  battery: z.number().min(0).max(100).optional(),
});

// Schéma pour climate
const climateTelemetrySchema = baseTelemetrySchema.extend({
  temperature: z.number(),
  humidity: z.number().min(0).max(100),
});

// Schéma pour presence
const presenceTelemetrySchema = baseTelemetrySchema.extend({
  motion: z.boolean(),
});

export const sendTelemetry = async (req: Request, res: Response) => {
  // 1. Authentifier le device
  const authResult = await authenticateDevice(req);
  if (!authResult.success) {
    return res.status(authResult.status).json({ message: authResult.message });
  }

  // 2. Vérifier que le device est actif
  const activeResult = requireActive(authResult.device);
  if (!activeResult.success) {
    return res
      .status(activeResult.status)
      .json({ message: activeResult.message });
  }

  const device = authResult.device;

  // 3. Valider les données selon le type du device
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

  // 4. Insérer la télémétrie
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
