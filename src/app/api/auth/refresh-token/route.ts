export const dynamic = "force-dynamic";

/**
 * POST /api/auth/refresh-token
 * Reads the refresh_token cookie, validates it against DB,
 * rotates it, and issues a new access_token + refresh_token pair.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  setAuthCookies,
  clearAuthCookies,
} from "@/lib/auth";
import { rotateRefreshToken } from "@/lib/authSessionService";
import { allowAuthRequest } from "@/lib/authRateLimit";

export async function POST(req: NextRequest) {
  return refresh(req);
}

export async function GET(req: NextRequest) {
  const from = req.nextUrl.searchParams.get("from");
  const response = await refresh(req);
  if (!response.ok || !from || !from.startsWith("/") || from.startsWith("//")) return response;

  const redirect = NextResponse.redirect(new URL(from, req.url));
  for (const cookie of response.cookies.getAll()) redirect.cookies.set(cookie);
  return redirect;
}

async function refresh(req: NextRequest) {
  try {
    const clientKey = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!allowAuthRequest(`refresh:${clientKey}`, 30, 15 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many refresh attempts. Try again later." }, { status: 429 });
    }
    const oldToken = req.cookies.get("refresh_token")?.value;
    if (!oldToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    const rotated = await rotateRefreshToken(oldToken);
    if (!rotated) {
      const res = NextResponse.json({ error: "Invalid, expired, or revoked refresh token" }, { status: 401 });
      clearAuthCookies(res);
      return res;
    }

    const res = NextResponse.json({ ok: true });
    setAuthCookies(res, rotated.accessToken, rotated.refreshToken);
    return res;
  } catch (err) {
    console.error("[POST /api/auth/refresh-token]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
