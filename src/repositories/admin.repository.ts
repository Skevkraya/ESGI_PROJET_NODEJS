import { ObjectId, UUID } from "mongodb";
import { getDB } from "../db.ts";
import type { Device, Status, Telemetry } from "../types.ts";

const devicesCollection = () => getDB().collection<Device>("devices");
const telemetryCollection = () => getDB().collection<Telemetry>("telemetry");

export const adminRepository = {
  findAll: (limit: number, offset: number, status: Status) =>
    devicesCollection()
      .find({
        ...(status && { status }),
      })
      .skip(offset)
      .limit(limit)
      .toArray(),

  updateStatus: (deviceId: string, status: Status) =>
    devicesCollection().updateOne(
      { deviceId: deviceId },
      { $set: { status: status } },
    ),

  getDevicesById: async (devId: string) => {
    return devicesCollection().findOne({ deviceId: devId });
  },

  revokeStatus: async (devId: string) => {
    const id = new ObjectId(devId);
    return devicesCollection().updateOne(
      { _id: id },
      { $set: { status: "revoked" } },
    );
  },

  getLastMeasure: async (devId: string) => {
    return telemetryCollection()
      .aggregate([
        { $match: { deviceId: devId } },
        { $sort: { timestamp: -1 } },
        {
          $group: { _id: "$deviceId", lastMeasure: { $first: "$$ROOT" } },
        },
      ])
      .toArray();
  },

  getTelemetryById: async (
    limit: number,
    offset: number,
    deviceId: string,
  ) => {
    const data = await telemetryCollection()
      .find({ deviceId })
      .project({ _id: 0, deviceId: 0 })
      .sort({ timestamp: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    const total = await telemetryCollection().countDocuments({ deviceId });

    return {
      data,
      pagination: {
        total,
        limit,
        offset,
      },
    };
  },
};
