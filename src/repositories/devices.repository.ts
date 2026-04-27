import { ObjectId, UUID } from "mongodb";
import { getDB } from "../db.ts";
import type { Device } from "../types.ts";

const collection = () => getDB().collection<Device>("devices");

export const devicesRepository = {
  findAll: (limit: number, offset: number) =>
    collection().find({}).skip(offset).limit(limit).toArray(),

  findByDeviceAccesKey: (deviceAccessKey: string) =>
    collection().findOne({ deviceAccessKey: deviceAccessKey }),

  findByMongoId: (id: ObjectId) => collection().findOne({ _id: id }),

  insert: (device: Device) => collection().insertOne(device),

  register: (device: Device) => collection().insertOne(device),

  deleteByMongoId: (id: ObjectId) => collection().deleteOne({ _id: id }),
};
