import { ObjectId, UUID } from "mongodb";
import { getDB } from "../db.ts";
import type { Device, Status, Telemetry } from "../types.ts";

const collection = () => getDB().collection<Device>("devices");
const collectionTelemetry = () => getDB().collection<Telemetry>("telemetry");

export const adminRepository = {
  findAll: (limit: number, offset: number, status: Status) =>
    collection()
      .find({
        ...(status && { status }),
      })
      .skip(offset)
      .limit(limit)
      .toArray(),

  updateStatus: (deviceId: string, status: Status) =>
    collection().updateOne(
      //pourquoi ce n'est pas id?,sur la requete s'est écrit :id et non pas :deviceId
      { deviceId: deviceId },
      { $set: { status: status } },
    ),

  //async pcq c une promise vu qu'il attend le retour de la bdd
  getDevicesById: async (devId: string) => {
    //const id = new ObjectId(devId);
    return collection().findOne({ deviceId: devId });
  },
  revokeStatus: async (devId: string) => {
    const id = new ObjectId(devId);
    return collection().updateOne({ _id: id }, { $set: { status: "revoked" } });
  },

  getLastMeasure: async (devId: string) => {
    //index pour faciliter la lécture
    //collection().createIndex({ deviceId: 1 });
    return collectionTelemetry()
      .aggregate([
        { $match: { deviceId: devId } },
        { $sort: { timestamp: -1 } },
        {
          $group: { _id: "$deviceId", lastMeasure: { $first: "$$ROOT" } },
        },
      ])
      .toArray();
  },
};
