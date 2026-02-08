import type { Device } from "../types.ts";
import type { Request, Response } from "express";
import { adminRepository } from "../repositories/admin.repository.ts";
import { z } from "zod";

export const getAllDevices = async (req: Request, res: Response) => {
  const status: string = req.query.status as string;
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
