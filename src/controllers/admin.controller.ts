import type { Device, Status } from "../types.ts";
import type { Request, Response } from "express";
import { adminRepository } from "../repositories/admin.repository.ts";
import { json, z } from "zod";
import strict from "assert/strict";

export const getAllDevices = async (req: Request, res: Response) => {
  //on peut créer un shemaZod ici comme on l'a fait en TP
  //refaire avec zod
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

//n'oublie pas de checker l'admin
export const getDeviceById = async (req: Request, res: Response) => {
  const idShema = z.object({
    //pour le cas de :id
    //devId: z.coerce.string().length(24),
    devId: z.coerce.string(),
  });
  //safeParse for ckecking the result
  const devIdResult = idShema.safeParse(req.params);
  if (!devIdResult.success) {
    return res
      .status(400)
      .json({ message: "Invalid url parameter:id is wrong" });
  }
  //continuer pour écrire la requete dans le repo

  const { devId } = devIdResult.data;
  //l'index est bon existe déja sur _id j pns qu'il faut rajouter sur la recherche objectId() et voi si la taille du id est limitée on dit que l'id de mongoDB c 24
  const result = await adminRepository.getDevicesById(devId);
  if (!result) {
    return res.status(404).json({ message: "Device not found" });
  }
  res.json(result);
  return devId;
};

export const revokedDevice = async (req: Request, res: Response) => {
  //il faut vériifier si le device existe
  //il faut qu'on vérifie les retour donc si c revoke on va avoir comme rep OK

  const deviceId = z.object({
    devId: z.coerce.string(),
    //pour le cas de :id
    //devId: z.coerce.string().length(24),
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
  //changer le statut en revoked
  const deviceRevoked = await adminRepository.revokeStatus(devId);
  if (!deviceRevoked) {
    return res.status(400).json({ message: "Bad request" });
  }
  //récup pour afficher
  const deviceUpdated = await adminRepository.getDevicesById(devId);
  res.status(200);
  res.json({ message: "ok", body: deviceUpdated });
};

export const lastMeasure = async (req: Request, res: Response) => {
  const deviceIdShema = z.object({
    deviceId: z.coerce.string(),
    //devId: z.coerce.string().length(24), dans le cas de :id
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
  //créer un index pour le deviceId
  const deviceTelemetryResult = await adminRepository.getLastMeasure(deviceId);
  if (!result) {
    return res.status(404).json({ message: "Device not found" });
  }
  res.status(200);
  res.status(200).json(deviceTelemetryResult);
};
