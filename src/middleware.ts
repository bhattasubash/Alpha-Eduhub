import { NextRequest, NextResponse } from "next/server";

// FORCE WORK MODE - All routes are publicly accessible
// This ensures the application works without database or authentication dependencies

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip middleware during build time to prevent deployment errors
  if (process.env.NEXT_PHASE === "phase-production-build" || 
      process.env.NEXT_PHASE === "phase-development-build") {
    return NextResponse.next();
  }

  // Allow all routes - force work mode
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files and _next
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
