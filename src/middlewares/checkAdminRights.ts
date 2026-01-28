import type { Request, Response } from "express";
import "dotenv/config";

export const checkAdminApiKey = async (req: Request, res: Response, next: any) => {
    const adminApiKey = req.headers["x-api-key"];

    if(adminApiKey === process.env.ADMIN_API_KEY) {
        next();
    } else {
        return res.status(403).json({message: "Forbidden: Invalid API Key"});
    }
}