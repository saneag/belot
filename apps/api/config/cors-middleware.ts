import type { NextFunction, Request, Response } from "express";

const defaultAllowedOrigins = ["http://localhost:5173", "https://belot-web.vercel.app"];

function getAllowedOrigins(): string[] {
  return (process.env.CORS_ORIGIN ?? defaultAllowedOrigins.join(","))
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  const origin = req.header("Origin");

  if (origin && getAllowedOrigins().includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
  }

  res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
}
