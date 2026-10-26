import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";
import { getEnv } from "./env.server";
import { ensureIndexes, sessionsCollection, usersCollection } from "./db.server";
import type { PublicUser, UserDoc, UserRole } from "./types.server";

const SESSION_COOKIE = "rs_session";
const SESSION_DAYS = 14;

export function toPublicUser(user: UserDoc): PublicUser {
  return {
    id: user._id.toHexString(),
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

function hashToken(token: string) {
  const secret = getEnv().sessionSecret;
  return createHash("sha256").update(`${token}:${secret}`).digest("hex");
}

export function createRawToken() {
  return randomBytes(32).toString("hex");
}

async function createSession(userId: ObjectId) {
  const token = createRawToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  const sessions = await sessionsCollection();
  await sessions.insertOne({
    _id: new ObjectId(),
    userId,
    tokenHash,
    expiresAt,
    createdAt: new Date(),
  });
  setCookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function destroySession() {
  const token = getCookie(SESSION_COOKIE);
  if (token) {
    const sessions = await sessionsCollection();
    await sessions.deleteOne({ tokenHash: hashToken(token) });
  }
  deleteCookie(SESSION_COOKIE);
}

export async function getSessionUser(): Promise<PublicUser | null> {
  await ensureIndexes();
  const token = getCookie(SESSION_COOKIE);
  if (!token) return null;

  const sessions = await sessionsCollection();
  const session = await sessions.findOne({
    tokenHash: hashToken(token),
    expiresAt: { $gt: new Date() },
  });
  if (!session) return null;

  const users = await usersCollection();
  const user = await users.findOne({ _id: session.userId });
  if (!user || user.status !== "active") return null;
  return toPublicUser(user);
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") throw new Error("FORBIDDEN");
  return user;
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}) {
  const users = await usersCollection();
  const email = input.email.trim().toLowerCase();
  const existing = await users.findOne({ email });
  if (existing) throw new Error("EMAIL_IN_USE");

  const now = new Date();
  const doc: UserDoc = {
    _id: new ObjectId(),
    name: input.name.trim(),
    email,
    passwordHash: await hashPassword(input.password),
    role: input.role ?? "user",
    status: "active",
    savedListingIds: [],
    resetToken: null,
    resetExpires: null,
    createdAt: now,
    updatedAt: now,
  };
  await users.insertOne(doc);
  return doc;
}

export async function loginWithPassword(email: string, password: string) {
  await ensureIndexes();
  const users = await usersCollection();
  const user = await users.findOne({ email: email.trim().toLowerCase() });
  if (!user) throw new Error("INVALID_CREDENTIALS");
  if (user.status !== "active") throw new Error("DISABLED");
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) throw new Error("INVALID_CREDENTIALS");
  await createSession(user._id);
  return toPublicUser(user);
}
