import { ObjectId, UUID } from "mongodb";
import { getDB } from "../db.ts";
import type { Device, Status } from "../types.ts";

const collection = () => getDB().collection<Device>("devices");

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
    const id = new ObjectId(devId);
    return collection().findOne({ _id: id });
  },
   revokeStatus:async(devId:string)=>{
    const id = new ObjectId(devId);
    return collection().updateOne({_id:id},{$set:{status:"revoked"}})
  }
}
