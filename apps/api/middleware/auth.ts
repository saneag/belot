import type { User } from "@belot/types";

import type { NextFunction, Request, Response } from "express";

import { ForbiddenError, UnauthorizedError } from "../errors/api-error.js";
import { getUserForToken } from "../services/auth-service.js";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      sessionToken?: string;
    }
  }
}

function getToken(req: Request) {
  const header = req.header("Authorization");
  if (header?.startsWith("Bearer ")) return header.slice(7).trim();
  const cookieName = process.env.AUTH_SESSION_COOKIE_NAME ?? "belot_session";
  const cookieHeader = req.header("Cookie") ?? "";
  return cookieHeader
    .split(";")
    .map((part) => part.trim().split("="))
    .find(([key]) => key === cookieName)?.[1];
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = getToken(req);
    const user = token ? await getUserForToken(token) : null;
    if (!user) throw new UnauthorizedError();
    req.user = user;
    req.sessionToken = token;
    next();
  } catch (error) {
    next(error);
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (req.user?.role !== "admin") {
    next(new ForbiddenError());
    return;
  }
  next();
}
