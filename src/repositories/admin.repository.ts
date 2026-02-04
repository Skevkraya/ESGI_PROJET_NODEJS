import { ObjectId, UUID } from "mongodb";
import { getDB } from "../db.ts";
import type { Device } from "../types.ts";

const collection = () => getDB().collection<Device>("devices");

export const adminRepository = {
  findAll: (limit: number, offset: number, status: string) =>
    collection()
      .find({
        ...(status && { status }),
      })
      .skip(offset)
      .limit(limit)
      .toArray(),

  updateStatus: (deviceId: string, status: string) =>
    collection().updateOne(
      { deviceId: deviceId },
      { $set: { status: status } },
    ),

  //async pcq c une promise vu qu'il attend le retour de la bdd
  getDevicesById: async (devId: string) => {
    const id = new ObjectId(devId);
    return collection().findOne({ _id: id });
  },
};
