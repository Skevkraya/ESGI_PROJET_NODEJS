import type { Device } from "../types.ts";
import type { Request, Response } from "express";
import { devicesRepository } from "../repositories/devices.repository.ts";
import { z } from "zod";
import { authenticateDevice } from "../middlewares/authDevice.middleware.ts";

export const registerDeviceController = async (req: Request, res: Response) => {
  const device: Device = req.body;
  const deviceAccessKey = "DEV-" + Math.random().toString(36).substring(2, 15);

  const CreateDeviceSchema = z.object({
    deviceId: z.string().uuid(),
    name: z.string().min(2).max(100),
    type: z.enum(["climate", "presence"]),
  });
  const resultZod = CreateDeviceSchema.safeParse({
    ...device,
    deviceAccessKey: deviceAccessKey,
  });
  if (!resultZod.success) {
    return res
      .status(400)
      .json({ message: "Invalid device data", errors: resultZod.error });
  }

  try {
    const result = await devicesRepository.register({
      ...device,
      deviceAccessKey: deviceAccessKey,
      status: "pending",
      createdAt: new Date(),
    });
    return res.status(201).json({
      message: "Device registered successfully",
      deviceAccessKey: deviceAccessKey,
      status: "pending",
    });
  } catch (error) {
    console.error("Error registering device:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const pollStatus = async (req: Request, res: Response) => {
  // Authentifier le device
  const authResult = await authenticateDevice(req);
  if (!authResult.success) {
    return res.status(authResult.status).json({ message: authResult.message });
  }

  const device = authResult.device;

  // Device révoqué ne peut pas poll (403)
  if (device.status === "revoked") {
    return res.status(403).json({ message: "Forbidden" });
  }

  // Retourner les infos (pending et active peuvent poll)
  return res.json({
    deviceId: device.deviceId,
    name: device.name,
    type: device.type,
    status: device.status,
  });
};
