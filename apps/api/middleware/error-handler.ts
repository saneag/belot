import type { ErrorRequestHandler, RequestHandler, Response } from "express";

import { HttpStatus } from "../constants/http-status.js";
import { ApiError } from "../errors/api-error.js";

export function sendApiError(error: unknown, res: Response): void {
  if (res.headersSent) {
    return;
  }

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  // Express body-parser errors expose their client-error status directly.
  if (isClientError(error)) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error(error);
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
}

function isClientError(error: unknown): error is { message: string; statusCode: number } {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const candidate = error as { message?: unknown; status?: unknown; statusCode?: unknown };
  const statusCode = candidate.statusCode ?? candidate.status;

  return (
    typeof candidate.message === "string" &&
    typeof statusCode === "number" &&
    statusCode >= 400 &&
    statusCode < 500
  );
}

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(HttpStatus.NOT_FOUND).json({ message: "Not found" });
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  sendApiError(error, res);
};
