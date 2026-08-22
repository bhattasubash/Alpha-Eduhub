import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth-edge";
import { getCanonicalRole } from "@/lib/roles";

// Public paths that do not require authentication
const PUBLIC_PATHS = new Set([
  "/",
  "/landing",
  "/app",
  "/sign-in",
  "/demo-login",
  "/demo-dashboard",
  "/logout",
  "/unauthorized",
  "/continue",
]);

const PUBLIC_API_PREFIXES = [
  "/api/auth/",
  "/api/demo-request",
  "/api/demo-login",
  "/api/demo-logout",
  "/api/setup-demo",
];

export async function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;

    // Skip middleware during build time
    if (
      process.env.NEXT_PHASE === "phase-production-build" ||
      process.env.NEXT_PHASE === "phase-development-build"
    ) {
      return NextResponse.next();
    }

    // Allow public static pages
    if (PUBLIC_PATHS.has(pathname)) {
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
      const signInUrl = req.nextUrl.clone();
      signInUrl.pathname = "/sign-in";
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    const role = payload.role;
    const canonicalRole = getCanonicalRole(role);

    // Super Admin route protection
    if (pathname.startsWith("/super-admin") || pathname.startsWith("/provider")) {
      if (canonicalRole !== "Super Admin") {
        const unauthUrl = req.nextUrl.clone();
        unauthUrl.pathname = "/unauthorized";
        return NextResponse.redirect(unauthUrl);
      }
    }

    // Admin route protection
    if (pathname.startsWith("/admin")) {
      if (canonicalRole !== "Super Admin" && canonicalRole !== "Admin") {
        const unauthUrl = req.nextUrl.clone();
        unauthUrl.pathname = "/unauthorized";
        return NextResponse.redirect(unauthUrl);
      }
    }

    return NextResponse.next();
  } catch (error) {
    // Bulletproof catch: never allow middleware to crash with unhandled exception
    console.error("[Middleware Error]:", error);
    if (req.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const signInUrl = req.nextUrl.clone();
    signInUrl.pathname = "/sign-in";
    return NextResponse.redirect(signInUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - static file extensions (svg, png, jpg, jpeg, gif, webp, ico, css, js, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf|eot)$).*)",
  ],
};
