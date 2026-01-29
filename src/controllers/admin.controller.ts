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
}

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
}