import { getDB } from "../db.ts";
import type { Telemetry } from "../types.ts";

const collection = () => getDB().collection<Telemetry>("Telemetry");

export const adminRepository = {
  postTelemetry: (telemetry: Telemetry, ) => collection().insertOne(telemetry)
  findAll: (limit: number, offset: number, status: string) =>
    collection().find({
        ...(status && { status })
    })
    .skip(offset)
    .limit(limit).toArray(),
  
  updateStatus: (deviceId: string, status: string) =>
    collection().updateOne( {deviceId: deviceId}, { $set: { status: status } }),

};
