/**
 * Reusable API route middleware.
 *
 * Usage:
 *   const session = await authenticateUser(req);
 *   if (!session) return unauthorized();
 *
 *   const authErr = authorizeRoles(session, ["admin", "teacher"]);
 *   if (authErr) return authErr;
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, type TokenPayload } from "@/lib/auth";
import { getCanonicalRole, type CanonicalRole } from "@/lib/getRole";

// ─── Read + verify access token from cookie ───────────────────────────────────

export async function authenticateUser(req: NextRequest): Promise<TokenPayload | null> {
  const token = req.cookies.get("access_token")?.value;
  if (!token) return null;
  return verifyAccessToken(token);
}

// ─── Extract Client Telemetry (IP & User-Agent) ───────────────────────────────

export function getClientTelemetry(req: NextRequest): { ipAddress: string; userAgent: string } {
  const ipAddress =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";
  const userAgent = req.headers.get("user-agent") || "Unknown Device";
  return { ipAddress, userAgent };
}

// ─── Role guard ────────────────────────────────────────────────────────────────

export function authorizeRoles(
  session: TokenPayload,
  allowedRoles: string[],
): NextResponse | null {
  const canonicalUser = getCanonicalRole(session.role);
  
  // Super Admin has access to all roles
  if (canonicalUser === "Super Admin") {
    return null;
  }
  
  const isAllowed = allowedRoles.some((role) => {
    if (role === session.role) return true;
    if (getCanonicalRole(role) === canonicalUser) return true;
    return false;
  });

  if (!isAllowed) {
    return NextResponse.json(
      { error: "Forbidden: insufficient role permission" },
      { status: 403 },
    );
  }
  return null; // allowed
}

// ─── School Data Isolation Guard ────────────────────────────────────────────────

export function authorizeSchoolAccess(
  session: TokenPayload,
  targetSchoolId: string,
): NextResponse | null {
  const canonical = getCanonicalRole(session.role);
  if (canonical === "Super Admin") return null; // Super Admin can access any school
  if (session.schoolId !== targetSchoolId) {
    return NextResponse.json(
      { error: "Forbidden: cross-tenant access denied" },
      { status: 403 },
    );
  }
  return null;
}

// ─── Convenience response helpers ─────────────────────────────────────────────

export function unauthorized(message = "Unauthorized"): NextResponse {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbidden(message = "Forbidden"): NextResponse {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function badRequest(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 400 });
}

