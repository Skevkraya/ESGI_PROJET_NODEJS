import type { Device } from "../types.ts";
import type { Request, Response } from "express";
import { devicesRepository } from "../repositories/devices.repository.ts";
import { z } from "zod";

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
      createdAt: new Date(),
    });
    return res.status(201).json({
      message: "Device registered successfully",
      deviceAccessKey: deviceAccessKey,
    });
  } catch (error) {
    console.error("Error registering device:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
