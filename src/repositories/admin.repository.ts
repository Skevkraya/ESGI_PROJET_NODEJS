import { ObjectId, UUID } from "mongodb";
import { getDB } from "../db.ts";
import type { Device } from "../types.ts";

const collection = () => getDB().collection<Device>("devices");

export const adminRepository = {
  findAll: (limit: number, offset: number, status: string) =>
    collection().find({
        ...(status && { status })
    })
    .skip(offset)
    .limit(limit).toArray(),
};
