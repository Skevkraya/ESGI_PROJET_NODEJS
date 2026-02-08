import { ObjectId, UUID } from "mongodb";
import { getDB } from "../db.ts";
import type { Device } from "../types.ts";
import type { Telemetry } from "../types.ts";

const devicesCollection = () => getDB().collection<Device>("devices");
const telemetryCollection = () => getDB().collection<Telemetry>("telemetry");

export const adminRepository = {
  findAll: (limit: number, offset: number, status: string) =>
    devicesCollection()
      .find({
        ...(status && { status }),
      })
      .skip(offset)
      .limit(limit)
      .toArray(),

  updateStatus: (deviceId: string, status: string) =>
    devicesCollection().updateOne(
      { deviceId: deviceId },
      { $set: { status: status } },
    ),

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
