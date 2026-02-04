import type { Device } from "../types.ts";
import type { Request, Response } from "express";
import { adminRepository } from "../repositories/admin.repository.ts";
import { z } from "zod";
import strict from "assert/strict";

export const getAllDevices = async (req: Request, res: Response) => {
  //on peut créer un shemaZod ici comme on l'a fait en TP
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

//n'oublie pas de checker l'admin
export const getDeviceById = async (req: Request, res: Response) => {
  const idShema = z.object({
    devId: z.coerce.string().length(24), //express le vois comme string mais pas MongoDB
  });
  //safeParse for ckecking the result
  const devIdResult = idShema.safeParse(req.params);
  if (!devIdResult.success) {
    return res.status(400).json({ message: "Invalid url parameter:id is wrong" });
  }
  //continuer pour écrire la requete dans le repo

  const { devId } = devIdResult.data;
  //l'index est bon existe déja sur _id j pns qu'il faut rajouter sur la recherche objectId() et voi si la taille du id est limitée on dit que l'id de mongoDB c 24
  const result = await adminRepository.getDevicesById(devId);
  res.json(result);
};
