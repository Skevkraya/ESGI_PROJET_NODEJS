import { getDB } from "../db.ts";
import type { Telemetry } from "../types.ts";

const collection = () => getDB().collection<Telemetry>("telemetry");
export const telemetryRepository = {
  insert: (telemetry: Telemetry) => collection().insertOne(telemetry),
};
