import { type IRouter, type Response, Router } from "express";

import { HttpStatus } from "../constants/http-status.js";
import { BadRequestError } from "../errors/api-error.js";
import { requireAuth } from "../middleware/auth.js";
import { sendApiError } from "../middleware/error-handler.js";
import { login, logout, register } from "../services/auth-service.js";

const router: IRouter = Router();
const cookieName = () => process.env.AUTH_SESSION_COOKIE_NAME ?? "belot_session";

function setSessionCookie(res: Response, token: string, expiresAt: string) {
  res.setHeader(
    "Set-Cookie",
    `${cookieName()}=${token}; HttpOnly; Path=/; SameSite=Lax; Expires=${new Date(expiresAt).toUTCString()}`,
  );
}

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body ?? {};
    if (typeof username !== "string" || typeof email !== "string" || typeof password !== "string") {
      throw new BadRequestError("Username, email, and password are required");
    }
    const session = await register({ username, email, password });
    setSessionCookie(res, session.token, session.expiresAt);
    res.status(HttpStatus.CREATED).json({ session });
  } catch (error) {
    sendApiError(error, res);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body ?? {};
    if (typeof identifier !== "string" || typeof password !== "string")
      throw new BadRequestError("Identifier and password are required");
    const session = await login({ identifier, password });
    setSessionCookie(res, session.token, session.expiresAt);
    res.status(HttpStatus.OK).json({ session });
  } catch (error) {
    sendApiError(error, res);
  }
});

router.post("/logout", requireAuth, async (req, res) => {
  try {
    if (req.sessionToken) await logout(req.sessionToken);
    res.setHeader("Set-Cookie", `${cookieName()}=; HttpOnly; Path=/; Max-Age=0`);
    res.sendStatus(HttpStatus.OK);
  } catch (error) {
    sendApiError(error, res);
  }
});

router.get("/session", requireAuth, (req, res) => {
  res.status(HttpStatus.OK).json({ user: req.user });
});

export default router;
