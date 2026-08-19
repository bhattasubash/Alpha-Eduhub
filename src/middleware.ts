import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth";
import { routeAccessMap } from "@/lib/settings";

// Build matchers once — compare pathname prefix against access map keys
function matchRoute(pathname: string): string[] | null {
  for (const [pattern, roles] of Object.entries(routeAccessMap)) {
    const regex = new RegExp(`^${pattern}$`);
    if (regex.test(pathname)) return roles as string[];
  }
  return null; // no rule → public route
}

// Routes that are always public (never require auth)
const PUBLIC_PATHS = [
  "/sign-in",
  "/",
  "/landing",
  "/demo-login",
  "/api/auth/login",
  "/api/auth/refresh-token",
  "/api/auth/me",
  "/api/auth/logout",
  "/api/demo-request",
  "/api/setup-demo",
  "/api/debug-role",
  "/api/demo-login",
  "/api/demo-logout",
];

function isPublic(pathname: string): boolean {
  // Check exact matches
  if (PUBLIC_PATHS.some((p) => pathname === p)) return true;
  
  // Check for dashboard subpages (make all dashboard routes public for demo)
  if (pathname.startsWith("/admin") || 
      pathname.startsWith("/teacher") || 
      pathname.startsWith("/student") || 
      pathname.startsWith("/parent") || 
      pathname.startsWith("/super-admin")) {
    return true;
  }
  
  // Check for path prefixes
  return PUBLIC_PATHS.some((p) => pathname.startsWith(`${p}/`));
}

/** Coarse API policy is enforced before handlers so API callers always receive
 * JSON 401/403 rather than a navigation redirect. Handlers retain their
 * resource-level ownership checks. */
function apiAllowedRoles(pathname: string): string[] | null {
  if (pathname.startsWith("/api/admin/")) return ["admin", "SCHOOL_ADMIN", "SUPER_ADMIN"];
  if (pathname.startsWith("/api/teacher/student-leave")) return ["teacher", "TEACHER", "admin", "SCHOOL_ADMIN", "SUPER_ADMIN"];
  if (pathname.startsWith("/api/teacher/")) return ["teacher", "TEACHER", "SUPER_ADMIN"];
  if (pathname.startsWith("/api/student/achievements/check")) return ["student", "STUDENT", "teacher", "TEACHER", "SCHOOL_ADMIN", "SUPER_ADMIN"];
  if (pathname.startsWith("/api/student/")) return ["student", "STUDENT", "SUPER_ADMIN"];
  if (pathname.startsWith("/api/parent/")) return ["PARENT", "SUPER_ADMIN"];
  return null;
}

/** Map a role to its home dashboard path */
function roleDashboard(role: string): string {
  switch (role) {
    case "SUPER_ADMIN": return "/super-admin";
    case "provider":    return "/provider";
    case "admin":
    case "SCHOOL_ADMIN":return "/admin";
    case "teacher":
    case "TEACHER":     return "/teacher";
    case "student":
    case "STUDENT":     return "/student";
    case "PARENT":      return "/parent";
    default:            return "/sign-in";
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip middleware entirely for API routes - let them handle auth internally
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Skip middleware during build time to prevent deployment errors
  if (process.env.NEXT_PHASE === "phase-production-build" || 
      process.env.NEXT_PHASE === "phase-development-build") {
    return NextResponse.next();
  }

  // Always allow static assets, Next.js internals, and public paths
  if (isPublic(pathname)) return NextResponse.next();

  // Verify access token from httpOnly cookie
  const token = req.cookies.get("access_token")?.value ?? null;
  const session = token ? await verifyAccessToken(token) : null;

  // No valid session → redirect to sign-in
  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized", refreshRequired: true }, { status: 401 });
    }
    if (req.cookies.get("refresh_token")?.value) {
      const refresh = new URL("/api/auth/refresh-token", req.url);
      refresh.searchParams.set("from", `${pathname}${req.nextUrl.search}`);
      return NextResponse.redirect(refresh);
    }
    const signIn = new URL("/sign-in", req.url);
    signIn.searchParams.set("from", pathname);
    return NextResponse.redirect(signIn);
  }

  if (pathname.startsWith("/api/")) {
    const roles = apiAllowedRoles(pathname);
    if (roles && !roles.includes(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // Check role-based access for matched routes
  const allowedRoles = matchRoute(pathname);
  if (allowedRoles) {
    const userRole = session.role;
    const canonicalUser = userRole === "SUPER_ADMIN" || userRole === "provider" ? "Super Admin" : userRole;
    
    // Super Admin has access to all routes
    const isSuperAdmin = canonicalUser === "Super Admin";
    
    const isAllowed = allowedRoles.some((allowed) => {
      if (isSuperAdmin) return true; // Super Admin bypasses all role checks
      if (allowed === userRole) return true;
      // Allow equivalent admin/teacher/student role variations
      if (["admin", "SCHOOL_ADMIN"].includes(allowed) && ["admin", "SCHOOL_ADMIN"].includes(userRole)) return true;
      if (["teacher", "TEACHER"].includes(allowed) && ["teacher", "TEACHER"].includes(userRole)) return true;
      if (["student", "STUDENT"].includes(allowed) && ["student", "STUDENT"].includes(userRole)) return true;
      if (["SUPER_ADMIN", "provider"].includes(allowed) && ["SUPER_ADMIN", "provider"].includes(userRole)) return true;
      return false;
    });

    if (!isAllowed) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      // Redirect to the user's own dashboard
      return NextResponse.redirect(new URL(roleDashboard(session.role), req.url));
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
