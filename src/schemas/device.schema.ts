import { z } from "zod";

export const registerDeviceSchema = z.object({
  deviceId: z.uuid(),
  name: z.string().min(2).max(100),
  type: z.enum(["climate", "presence"]),
});

export type RegisterDeviceInput = z.infer<typeof registerDeviceSchema>;
