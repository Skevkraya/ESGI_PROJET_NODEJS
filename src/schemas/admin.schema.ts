import { z } from "zod";

export const deviceIdParamSchema = z.object({
  id: z.string().min(1, "Device id is required"),
});

export const listDevicesQuerySchema = z.object({
  status: z.enum(["pending", "active", "revoked"]).optional(),
  limit: z.coerce
    .number()
    .int("Limit must be an integer")
    .min(1, "Limit must be at least 1")
    .max(100, "Limit cannot exceed 100")
    .default(20),
  offset: z.coerce
    .number()
    .int("Offset must be an integer")
    .min(0, "Offset cannot be negative")
    .default(0),
});

export const telemetryListSchema = z.object({
  params: deviceIdParamSchema,
  query: z.object({
    limit: z.coerce
      .number()
      .int("Limit must be an integer")
      .min(1, "Limit must be at least 1")
      .max(100, "Limit cannot exceed 100")
      .default(20),
    offset: z.coerce
      .number()
      .int("Offset must be an integer")
      .min(0, "Offset cannot be negative")
      .default(0),
  }),
});

export type DeviceIdParam = z.infer<typeof deviceIdParamSchema>;
export type ListDevicesQuery = z.infer<typeof listDevicesQuerySchema>;
export type TelemetryListInput = z.infer<typeof telemetryListSchema>;
