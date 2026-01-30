import type { Telemetry } from "../types.ts";
import type { Request, Response } from "express";
import { telemetryRepository } from "../repositories/telemetry.repository.ts";
import { z } from "zod";

export const sendDeviceTelemetry = async (req: Request, res: Response) => {
    const telemetry: Telemetry = req.body;
    const deviceAccessKey = req.headers['x-device-key'];

    try {
        const result = await telemetryRepository.postTelemetry({
        ...telemetry,
        deviceAccessKey: deviceAccessKey,
        createdAt: new Date(),
        });
        return res.status(201).json({
        message: "Telemetry successfully sent",
        });
    } catch (error) {
        console.error("Error sending telemetry: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }

}