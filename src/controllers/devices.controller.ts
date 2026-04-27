import type { Request, Response } from "express";
import { devicesRepository } from "../repositories/devices.repository.ts";
import { authenticateDevice } from "../middlewares/authDevice.middleware.ts";
import { registerDeviceSchema } from "../schemas/device.schema.ts";

export const registerDeviceController = async (req: Request, res: Response) => {
  const validation = registerDeviceSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      message: "Invalid device data",
      errors: validation.error.issues,
    });
  }

  const { deviceId, name, type } = validation.data;
  const deviceAccessKey = "DEV-" + Math.random().toString(36).substring(2, 15);

  try {
    await devicesRepository.register({
      deviceId,
      name,
      type,
      deviceAccessKey,
      status: "pending",
      createdAt: new Date(),
    });
    return res.status(201).json({
      message: "Device registered successfully",
      deviceAccessKey,
      status: "pending",
    });
  } catch (error) {
    console.error("Error registering device:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const pollStatus = async (req: Request, res: Response) => {
  const authResult = await authenticateDevice(req);
  if (!authResult.success) {
    return res.status(authResult.status).json({ message: authResult.message });
  }

  const device = authResult.device;

  if (device.status === "revoked") {
    return res.status(403).json({ message: "Forbidden" });
  }

  return res.json({
    deviceId: device.deviceId,
    name: device.name,
    type: device.type,
    status: device.status,
  });
};
