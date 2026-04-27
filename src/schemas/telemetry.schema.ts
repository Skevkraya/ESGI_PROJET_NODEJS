import { z } from "zod";

const baseTelemetrySchema = z.object({
  timestamp: z.iso.datetime(),
  battery: z.number().min(0).max(100).optional(),
});

export const climateTelemetrySchema = baseTelemetrySchema.extend({
  temperature: z.number(),
  humidity: z.number().min(0).max(100),
});

export const presenceTelemetrySchema = baseTelemetrySchema.extend({
  motion: z.boolean(),
});

export type ClimateTelemetryInput = z.infer<typeof climateTelemetrySchema>;
export type PresenceTelemetryInput = z.infer<typeof presenceTelemetrySchema>;
