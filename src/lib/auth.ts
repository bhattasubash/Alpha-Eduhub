/**
 * Custom JWT authentication helpers.
 * Uses `jose` (Edge-compatible) for token sign/verify.
 * Uses `bcryptjs` for password hashing (Node.js only — API routes / server actions).
 */

import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// ─── Constants ───────────────────────────────────────────────────────────────

const ACCESS_TOKEN_COOKIE  = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";

const ACCESS_TOKEN_EXPIRY  = "15m";   // short-lived
const REFRESH_TOKEN_EXPIRY = "7d";    // long-lived

// ─── Secret keys (loaded once at module level) ───────────────────────────────

function getSecret(envKey: string): Uint8Array {
  const val = process.env[envKey];
  if (!val) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`CRITICAL SECURITY ERROR: Missing environment variable: ${envKey}`);
    }
    console.error(`[AUTH] Missing environment variable: ${envKey}. Please configure it in your .env file.`);
    throw new Error(`Missing required auth secret: ${envKey}`);
  }
  return new TextEncoder().encode(val);
}

// ─── Token payload shape ─────────────────────────────────────────────────────

export interface TokenPayload extends JWTPayload {
  userId:   string;
  role:     string;
  schoolId: string | null;
  username: string;
  impersonatorId?: string;
}

// ─── Sign ─────────────────────────────────────────────────────────────────────

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

// ─── Verify ───────────────────────────────────────────────────────────────────

export async function verifyAccessToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret("JWT_ACCESS_SECRET"));
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret("JWT_REFRESH_SECRET"));
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

// ─── Cookie helpers ───────────────────────────────────────────────────────────

/** Set both tokens as httpOnly cookies on a NextResponse */
export function setAuthCookies(
  res: NextResponse,
  accessToken: string,
  refreshToken: string,
) {
  const secure = process.env.NODE_ENV === "production";

  res.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,           // 15 minutes
  });

  res.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/** Clear both auth cookies (logout) */
export function clearAuthCookies(res: NextResponse) {
  res.cookies.set(ACCESS_TOKEN_COOKIE,  "", { maxAge: 0, path: "/" });
  res.cookies.set(REFRESH_TOKEN_COOKIE, "", { maxAge: 0, path: "/" });
}

// ─── Read token from request (middleware-safe) ────────────────────────────────

export function getAccessTokenFromRequest(req: NextRequest): string | null {
  return req.cookies.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

export function getRefreshTokenFromRequest(req: NextRequest): string | null {
  return req.cookies.get(REFRESH_TOKEN_COOKIE)?.value ?? null;
}

// ─── Server-component helper — reads token from cookies() ────────────────────

/**
 * Read + verify the access token in a Server Component or Server Action.
 * Returns the decoded payload or null.
 */
export async function getServerSession(): Promise<TokenPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
    if (!token) return null;
    return await verifyAccessToken(token);
  } catch {
    return null;
  }
}

// ─── Compute refresh token expiry date ───────────────────────────────────────

export function refreshTokenExpiryDate(): Date {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
}

/** A database breach must not disclose reusable refresh credentials. */
export async function hashRefreshToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
