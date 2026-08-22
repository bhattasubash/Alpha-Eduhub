import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth";
import { getCanonicalRole } from "@/lib/getRole";

// Public routes that do not require authentication
const PUBLIC_PATHS = [
  "/",
  "/sign-in",
  "/demo-login",
  "/logout",
  "/unauthorized",
  "/continue",
];

const PUBLIC_API_PREFIXES = [
  "/api/auth/login",
  "/api/auth/demo-login",
  "/api/auth/refresh-token",
  "/api/auth/logout",
  "/api/demo-request",
  "/api/demo-login",
  "/api/demo-logout",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip middleware during build time
  if (
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.NEXT_PHASE === "phase-development-build"
  ) {
    return NextResponse.next();
  }

  // Allow public static pages
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow public API routes
  if (PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Read and verify access token from cookie
  const token = req.cookies.get("access_token")?.value;
  const payload = token ? await verifyAccessToken(token) : null;

  if (!payload) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  const role = payload.role;
  const canonicalRole = getCanonicalRole(role);

  // Super Admin route protection
  if (pathname.startsWith("/super-admin") || pathname.startsWith("/provider")) {
    if (canonicalRole !== "Super Admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  // Admin route protection
  if (pathname.startsWith("/admin")) {
    if (canonicalRole !== "Super Admin" && canonicalRole !== "Admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files and _next
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
