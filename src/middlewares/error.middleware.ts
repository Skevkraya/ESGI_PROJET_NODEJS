import type { NextFunction, Request, Response } from "express";

type HttpError = Error & {
  status?: number;
  code?: string;
};

export const notFoundMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`) as HttpError;
  error.status = 404;
  error.code = "ROUTE_NOT_FOUND";
  next(error);
};

export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const error = err instanceof Error ? (err as HttpError) : null;

  const status = error?.status && error.status >= 400 ? error.status : 500;
  const isServerError = status >= 500;

  if (isServerError) {
    console.error("Unhandled error:", err);
  }

  return res.status(status).json({
    message: isServerError ? "Internal server error" : error?.message ?? "Error",
    ...(error?.code ? { code: error.code } : {}),
  });
};
