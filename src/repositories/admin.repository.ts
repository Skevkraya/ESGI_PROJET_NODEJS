import { getDB } from "../db.ts";
import type { Device, Status, Telemetry } from "../types.ts";

const devicesCollection = () => getDB().collection<Device>("devices");
const telemetryCollection = () => getDB().collection<Telemetry>("telemetry");

export const adminRepository = {
  findAll: (limit: number, offset: number, status?: Status) =>
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
    return devicesCollection().updateOne(
      { deviceId: devId },
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

  getDeviceStats: async (
    deviceId: string,
    deviceType: string,
    from: Date,
    to: Date,
  ) => {
    const [stats] = await telemetryCollection()
      .aggregate([
        {
          $match: {
            deviceId,
            timestamp: { $gte: from, $lte: to },
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            temperatureMin: { $min: "$temperature" },
            temperatureMax: { $max: "$temperature" },
            temperatureAvg: { $avg: "$temperature" },
            humidityMin: { $min: "$humidity" },
            humidityMax: { $max: "$humidity" },
            humidityAvg: { $avg: "$humidity" },
            motionDetected: {
              $sum: {
                $cond: [{ $eq: ["$motion", true] }, 1, 0],
              },
            },
          },
        },
      ])
      .toArray();

    if (deviceType === "presence") {
      return {
        count: stats?.count ?? 0,
        motionDetected: stats?.motionDetected ?? 0,
      };
    }

    return {
      count: stats?.count ?? 0,
      temperature: {
        min: stats?.temperatureMin ?? null,
        max: stats?.temperatureMax ?? null,
        avg: stats?.temperatureAvg ?? null,
      },
      humidity: {
        min: stats?.humidityMin ?? null,
        max: stats?.humidityMax ?? null,
        avg: stats?.humidityAvg ?? null,
      },
    };
  },
};
