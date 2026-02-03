import { getDB } from "../db.ts";
import type { Telemetry } from "../types.ts";

const collection = () => getDB().collection<Telemetry>("telemetry");

//     En double de admin.repository.ts a enlever pour moi [Renaud]

// export const adminRepository = {
//   postTelemetry: (telemetry: Telemetry, ) => collection().insertOne(telemetry)
//   findAll: (limit: number, offset: number, status: string) =>
//     collection().find({
//         ...(status && { status })
//     })
//     .skip(offset)
//     .limit(limit).toArray(),

//   updateStatus: (deviceId: string, status: string) =>
//     collection().updateOne( {deviceId: deviceId}, { $set: { status: status } }),

//};

export const telemetryRepository = {
  insert: (telemetry: Telemetry) => collection().insertOne(telemetry),
};
