/**
 * Edge-safe JWT token verification helpers.
 * Uses `jose` only — zero Node.js APIs, zero next/headers, zero Prisma.
 * 100% safe to import from middleware.ts (Edge Runtime).
 */

import { SignJWT, jwtVerify, type JWTPayload } from "jose";

// ─── Token payload shape ─────────────────────────────────────────────────────

export interface TokenPayload extends JWTPayload {
  userId:   string;
  role:     string;
  schoolId: string | null;
  username: string;
  impersonatorId?: string;
}

// ─── Secret keys (with safe fallback to prevent Edge worker initialization crashes) ─

const DEFAULT_JWT_SECRET = "alpha-eduhub-jwt-access-secret-default-key-2024";
const DEFAULT_REFRESH_SECRET = "alpha-eduhub-jwt-refresh-secret-default-key-2024";

function getSecret(envKey: string): Uint8Array {
  const val =
    process.env[envKey] ||
    (envKey === "JWT_ACCESS_SECRET"
      ? process.env.JWT_SECRET || DEFAULT_JWT_SECRET
      : DEFAULT_REFRESH_SECRET);
  return new TextEncoder().encode(val);
}

// ─── Verify ───────────────────────────────────────────────────────────────────

export async function verifyAccessToken(token: string): Promise<TokenPayload | null> {
  try {
    if (!token || typeof token !== "string") return null;
    const { payload } = await jwtVerify(token, getSecret("JWT_ACCESS_SECRET"));
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<TokenPayload | null> {
  try {
    if (!token || typeof token !== "string") return null;
    const { payload } = await jwtVerify(token, getSecret("JWT_REFRESH_SECRET"));
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

// ─── Sign ─────────────────────────────────────────────────────────────────────

const ACCESS_TOKEN_EXPIRY  = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

export async function signAccessToken(payload: Omit<TokenPayload, "iat" | "exp">): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(getSecret("JWT_ACCESS_SECRET"));
}

export async function signRefreshToken(payload: Omit<TokenPayload, "iat" | "exp">): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(getSecret("JWT_REFRESH_SECRET"));
}

// ─── Hashing (uses Web Crypto — Edge-safe) ────────────────────────────────────

export async function hashRefreshToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

// ─── Refresh token expiry ────────────────────────────────────────────────────

export function refreshTokenExpiryDate(): Date {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
}
