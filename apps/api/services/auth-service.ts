import type { LoginInput, RegisterInput, User, UserRole } from "@belot/types";

import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

import { BadRequestError, UnauthorizedError } from "../errors/api-error.js";
import Session from "../schemas/session-schema.js";
import UserModel from "../schemas/user-schema.js";

const scrypt = promisify(scryptCallback);
export const SESSION_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;

export const normalizeUsername = (value: string) => value.trim().toLowerCase();
export const normalizeEmail = (value: string) => value.trim().toLowerCase();

async function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return { hash: derived.toString("hex"), salt };
}

async function verifyPassword(password: string, hash: string, salt: string) {
  const derived = (await hashPassword(password, salt)).hash;
  return timingSafeEqual(Buffer.from(derived, "hex"), Buffer.from(hash, "hex"));
}

function toUser(user: { _id: unknown; username: string; email: string; role: UserRole }): User {
  return { id: String(user._id), username: user.username, email: user.email, role: user.role };
}

function validateCredentials(username: string, email: string, password: string) {
  if (username.length < 3 || !/^[a-z0-9_-]+$/.test(username)) {
    throw new BadRequestError("Username must contain at least 3 letters, numbers, _ or -");
  }
  if (!email.includes("@") || email.length > 254) throw new BadRequestError("Email is invalid");
  if (password.length < 8) throw new BadRequestError("Password must be at least 8 characters");
}

export async function createSession(user: User) {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = (await hashPassword(token, "session-token-salt")).hash;
  const expiresAt = new Date(Date.now() + SESSION_LIFETIME_MS);
  await Session.create({ user: user.id, tokenHash, expiresAt });
  return { user, token, expiresAt: expiresAt.toISOString() };
}

export async function register(input: RegisterInput) {
  const username = normalizeUsername(input.username);
  const email = normalizeEmail(input.email);
  validateCredentials(username, email, input.password);
  const existing = await UserModel.findOne().where({ $or: [{ username }, { email }] });
  if (existing) throw new BadRequestError("Unable to create account with those details");
  const { hash, salt } = await hashPassword(input.password);
  const user = await UserModel.create({ username, email, passwordHash: hash, passwordSalt: salt });
  const session = await createSession(toUser(user));
  return session;
}

export async function login(input: LoginInput) {
  const identifier = input.identifier.trim().toLowerCase();
  const user = await UserModel.findOne()
    .where({ $or: [{ username: identifier }, { email: identifier }] })
    .select("+passwordHash +passwordSalt");
  if (!user || !(await verifyPassword(input.password, user.passwordHash, user.passwordSalt))) {
    throw new UnauthorizedError("Invalid credentials");
  }
  return createSession(toUser(user));
}

export async function getUserForToken(token: string): Promise<User | null> {
  const tokenHash = (await hashPassword(token, "session-token-salt")).hash;
  const session = await Session.findOne()
    .where({ tokenHash, expiresAt: { $gt: new Date() } })
    .populate("user");
  if (!session || !session.user || typeof session.user !== "object") return null;
  return toUser(
    session.user as unknown as { _id: unknown; username: string; email: string; role: UserRole },
  );
}

export async function logout(token: string) {
  const tokenHash = (await hashPassword(token, "session-token-salt")).hash;
  await Session.deleteOne({ tokenHash });
}

export async function provisionAdmin() {
  const {
    AUTH_ADMIN_USERNAME: usernameValue,
    AUTH_ADMIN_EMAIL: emailValue,
    AUTH_ADMIN_PASSWORD: password,
  } = process.env;
  if (!usernameValue || !emailValue || !password) return;
  const username = normalizeUsername(usernameValue);
  const email = normalizeEmail(emailValue);
  const { hash, salt } = await hashPassword(password);
  await UserModel.updateOne(
    { $or: [{ username }, { email }] },
    { $set: { username, email, passwordHash: hash, passwordSalt: salt, role: "admin" } },
    { upsert: true },
  );
}
