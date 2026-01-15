import type { Request, Response } from "express";

export const ping = (_req: Request, res: Response): void => {
  res.json({ ok: true });
};
