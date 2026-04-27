import type { Request, Response } from "express";
import { adminRepository } from "../repositories/admin.repository.ts";
import {
  deviceIdParamSchema,
  listDevicesQuerySchema,
  telemetryListSchema,
} from "../schemas/admin.schema.ts";

export const getAllDevices = async (req: Request, res: Response) => {
  const validation = listDevicesQuerySchema.safeParse(req.query);
  if (!validation.success) {
    return res.status(400).json({
      message: "Invalid query parameters",
      errors: validation.error.issues,
    });
  }
  const { status, limit, offset } = validation.data;

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
  const paramsResult = deviceIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({
      message: "Invalid url parameter",
      errors: paramsResult.error.issues,
    });
  }
  const { id } = paramsResult.data;
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
  const paramsResult = deviceIdParamSchema.safeParse({ id: req.params.devId });
  if (!paramsResult.success) {
    return res.status(400).json({
      message: "Invalid url parameter",
      errors: paramsResult.error.issues,
    });
  }
  const { id: devId } = paramsResult.data;

  const result = await adminRepository.getDevicesById(devId);
  if (!result) {
    return res.status(404).json({ message: "Device not found" });
  }
  return res.json(result);
};

export const revokedDevice = async (req: Request, res: Response) => {
  const paramsResult = deviceIdParamSchema.safeParse({ id: req.params.devId });
  if (!paramsResult.success) {
    return res.status(400).json({
      message: "Invalid url parameter",
      errors: paramsResult.error.issues,
    });
  }
  const { id: devId } = paramsResult.data;

  const device = await adminRepository.getDevicesById(devId);
  if (!device) {
    return res.status(404).json({ message: "Device not found" });
  }
  const deviceRevoked = await adminRepository.revokeStatus(devId);
  if (!deviceRevoked) {
    return res.status(400).json({ message: "Bad request" });
  }
  const deviceUpdated = await adminRepository.getDevicesById(devId);
  return res.status(200).json({ message: "ok", body: deviceUpdated });
};

export const lastMeasure = async (req: Request, res: Response) => {
  const paramsResult = deviceIdParamSchema.safeParse({
    id: req.params.deviceId,
  });
  if (!paramsResult.success) {
    return res.status(400).json({
      message: "Invalid url parameter",
      errors: paramsResult.error.issues,
    });
  }
  const { id: deviceId } = paramsResult.data;

  const result = await adminRepository.getDevicesById(deviceId);
  if (!result) {
    return res.status(404).json({ message: "Device not found" });
  }
  const deviceTelemetryResult = await adminRepository.getLastMeasure(deviceId);
  return res.status(200).json(deviceTelemetryResult);
};

export const getTelemetryById = async (req: Request, res: Response) => {
  const validation = telemetryListSchema.safeParse({
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
