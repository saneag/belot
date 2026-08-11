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

  const clientError = getClientError(error);
  if (clientError) {
    res.status(clientError.statusCode).json({ message: clientError.message });
    return;
  }

  console.error(error);
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
}

function getClientError(error: unknown): { message: string; statusCode: number } | null {
  if (typeof error !== "object" || error === null) {
    return null;
  }

  const candidate = error as { message?: unknown; status?: unknown; statusCode?: unknown };
  const statusCode = candidate.statusCode ?? candidate.status;

  if (
    typeof candidate.message === "string" &&
    typeof statusCode === "number" &&
    statusCode >= 400 &&
    statusCode < 500
  ) {
    return { message: candidate.message, statusCode };
  }

  return null;
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
