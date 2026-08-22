/**
 * Full authentication helpers (Node.js runtime only).
 * Re-exports all Edge-safe helpers from auth-edge.ts, plus adds
 * next/headers-dependent server helpers (getServerSession, cookie helpers).
 *
 * NEVER import this file from middleware.ts — use @/lib/auth-edge instead.
 */

// Re-export everything from the Edge-safe module for backward compatibility
export {
  type TokenPayload,
  verifyAccessToken,
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
  hashRefreshToken,
  refreshTokenExpiryDate,
} from "./auth-edge";

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, type TokenPayload } from "./auth-edge";

// ─── Constants ───────────────────────────────────────────────────────────────

const ACCESS_TOKEN_COOKIE  = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";

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

// ─── Read token from request (middleware-safe via NextRequest) ────────────────

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
