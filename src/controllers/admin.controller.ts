import type { Device, Status } from "../types.ts";
import type { Request, Response } from "express";
import { adminRepository } from "../repositories/admin.repository.ts";
import { json, z } from "zod";
import strict from "assert/strict";

export const getAllDevices = async (req: Request, res: Response) => {
  const status: Status = req.query.status as Status;
  const limit: number = parseInt(req.query.limit as string);
  const offset: number = parseInt(req.query.offset as string);

  try {
    const device = await adminRepository.findAll(limit, offset, status);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }
    return res.json(device);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const approveDevice = async (req: Request, res: Response) => {
  const id: string = req.params.id as string;
  const status = "active";

  try {
    const result = await adminRepository.updateStatus(id, status);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error approving device:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getDeviceById = async (req: Request, res: Response) => {
  const idShema = z.object({
    devId: z.coerce.string(),
  });
  const devIdResult = idShema.safeParse(req.params);
  if (!devIdResult.success) {
    return res
      .status(400)
      .json({ message: "Invalid url parameter:id is wrong" });
  }

  const { devId } = devIdResult.data;
  const result = await adminRepository.getDevicesById(devId);
  if (!result) {
    return res.status(404).json({ message: "Device not found" });
  }
  res.json(result);
  return devId;
};

export const revokedDevice = async (req: Request, res: Response) => {
  const deviceId = z.object({
    devId: z.coerce.string(),
  });
  const devIdResult = deviceId.safeParse(req.params);
  if (!devIdResult.success) {
    console.log("devId", devIdResult);
    return res
      .status(400)
      .json({ message: "Invalid url parameter:id is wrong" });
  }
  const { devId } = devIdResult.data;
  const device = await adminRepository.getDevicesById(devId);
  if (!device) {
    return res.status(404).json({ message: "Device not found" });
  }
  const deviceRevoked = await adminRepository.revokeStatus(devId);
  if (!deviceRevoked) {
    return res.status(400).json({ message: "Bad request" });
  }
  const deviceUpdated = await adminRepository.getDevicesById(devId);
  res.status(200);
  res.json({ message: "ok", body: deviceUpdated });
};

export const lastMeasure = async (req: Request, res: Response) => {
  const deviceIdShema = z.object({
    deviceId: z.coerce.string(),
  });

  const devIdResult = deviceIdShema.safeParse(req.params);
  if (!devIdResult.success) {
    console.log("devId", devIdResult);
    return res.status(400).json({ message: "Invalid url parameter" });
  }
  const { deviceId } = devIdResult.data;
  const result = await adminRepository.getDevicesById(deviceId);
  if (!result) {
    return res.status(404).json({ message: "Device not found" });
  }
  const deviceTelemetryResult = await adminRepository.getLastMeasure(deviceId);
  if (!result) {
    return res.status(404).json({ message: "Device not found" });
  }
  res.status(200).json(deviceTelemetryResult);
};

const getTelemetryByIdSchema = z.object({
  params: z.object({
    id: z.string("Invalid device ID format"),
  }),
  query: z.object({
    limit: z.coerce
      .number()
      .int("Limit must be an integer")
      .min(1, "Limit must be at least 1")
      .max(100, "Limit cannot exceed 100")
      .default(20),
    offset: z.coerce
      .number()
      .int("Offset must be an integer")
      .min(0, "Offset cannot be negative")
      .default(0),
  }),
});

export const getTelemetryById = async (req: Request, res: Response) => {
  const validation = getTelemetryByIdSchema.safeParse({
    params: req.params,
    query: req.query,
  });

  if (!validation.success) {
    return res.status(400).json({
      message: "Invalid request parameters",
      errors: validation.error.issues,
    });
  }

  const { id: deviceId } = validation.data.params;
  const { limit, offset } = validation.data.query;

  try {
    const result = await adminRepository.getTelemetryById(
      limit,
      offset,
      deviceId,
    );

    const formattedData = result.data.map((item) => ({
      ...item,
      timestamp:
        item.timestamp instanceof Date
          ? item.timestamp.toISOString()
          : item.timestamp,
    }));

    return res.json({
      data: formattedData,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error getting telemetry:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
