import type { Request } from "express";
import { devicesRepository } from "../repositories/devices.repository.ts";
import type { Device } from "../types.ts";

type AuthResult =
  | { success: true; device: Device }
  | { success: false; status: number; message: string };

export const authenticateDevice = async (req: Request): Promise<AuthResult> => {
  const deviceKey = req.headers["x-device-key"];

  // Vérifier que la clé est présente
  if (!deviceKey || typeof deviceKey !== "string") {
    return { success: false, status: 401, message: "Unauthorized" };
  }

  // Récupérer le device
  const device = await devicesRepository.findByDeviceAccesKey(deviceKey);

  if (!device) {
    return { success: false, status: 401, message: "Unauthorized" };
  }

  return { success: true, device };
};

// Vérifie que le device est actif
// Retourne une erreur si pending ou revoked

export const requireActive = (device: Device): AuthResult => {
  if (device.status !== "active") {
    return { success: false, status: 403, message: "Forbidden" };
  }
  return { success: true, device };
};
