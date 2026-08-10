/**
 * Server-side role/session helpers.
 * Reads the JWT access token from the httpOnly cookie.
 */

import { cookies } from "next/headers";
import { getServerSession, type TokenPayload } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const VALID_ROLES = [
  "SUPER_ADMIN",
  "provider",
  "admin",
  "SCHOOL_ADMIN",
  "teacher",
  "TEACHER",
  "student",
  "STUDENT",
  "PARENT",
] as const;

export type AppRole = (typeof VALID_ROLES)[number];

export type CanonicalRole = "Super Admin" | "Admin" | "Teacher" | "Student" | "Parent";

/** Map internal database/JWT roles to the 5 canonical platform roles */
export function getCanonicalRole(role: string): CanonicalRole {
  switch (role) {
    case "SUPER_ADMIN":
    case "provider":
      return "Super Admin";
    case "admin":
    case "SCHOOL_ADMIN":
      return "Admin";
    case "teacher":
    case "TEACHER":
      return "Teacher";
    case "student":
    case "STUDENT":
      return "Student";
    case "PARENT":
      return "Parent";
    default:
      return "Student";
  }
}

export function isTeacherRole(role: string | null | undefined): boolean {
  return role === "teacher" || role === "TEACHER";
}

/**
 * Returns the current user's role from the JWT session.
 * Returns null when not authenticated.
 */
export async function getRole(): Promise<AppRole | null> {
  const session = await getServerSession();
  if (!session) return null;
  const role = session.role as AppRole;
  if ((VALID_ROLES as readonly string[]).includes(role)) return role;
  return null;
}

/**
 * Returns the full session payload (userId, role, schoolId, username).
 * Returns null when not authenticated.
 */
export async function getSession(): Promise<TokenPayload | null> {
  return getServerSession();
}

/**
 * Returns the active school context ID.
 * If Super Admin has selected a school via context switcher cookie, returns that ID.
 * Otherwise returns the user's assigned schoolId.
 */
export async function getActiveSchoolId(): Promise<string | null> {
  const session = await getServerSession();
  if (!session) return null;

  if (session.role === "SUPER_ADMIN" || session.role === "provider") {
    try {
      const activeContext = cookies().get("super_admin_school_context")?.value;
      if (activeContext) return activeContext;
    } catch {
      // Fall through to session.schoolId
    }
  }

  return session.schoolId ?? null;
}

/**
 * Returns the current user's ID from the JWT session.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getServerSession();
  return session?.userId ?? null;
}

/**
 * Returns the current user's schoolId from the JWT session.
 */
export async function getCurrentSchoolId(): Promise<string | null> {
  const session = await getServerSession();
  return session?.schoolId ?? null;
}

/**
 * Generates Prisma where clause object for multi-tenant data isolation.
 * For Admin, Teacher, Student, and Parent: restricts to their schoolId.
 * For Super Admin: returns empty filter (or active context filter if selected).
 */
export function getTenantWhereClause(session: TokenPayload, activeSchoolId?: string | null) {
  const canonical = getCanonicalRole(session.role);
  if (canonical === "Super Admin") {
    return activeSchoolId ? { schoolId: activeSchoolId } : {};
  }
  return { schoolId: session.schoolId ?? undefined };
}

import { redirect } from "next/navigation";

/**
 * Require a valid session. Redirects to /sign-in if not authenticated.
 * Redirects to / if role is not in allowedRoles.
 */
export async function requireSession(
  allowedRoles?: AppRole[],
): Promise<TokenPayload> {
  const session = await getServerSession();
  if (!session) {
    redirect("/sign-in");
  }
  if (allowedRoles && !allowedRoles.includes(session.role as AppRole)) {
    redirect("/");
  }
  return session;
}

/**
 * Asserts caller belongs to the target school record or has Super Admin access.
 * Super Admin bypasses this check.
 */
export async function assertSchoolOwnership(
  session: TokenPayload,
  targetSchoolId: string,
): Promise<void> {
  const canonical = getCanonicalRole(session.role);
  if (canonical === "Super Admin") return;
  if (session.schoolId !== targetSchoolId) throw new Error("Forbidden");
}

/**
 * Returns true if the current user is a Super Admin.
 */
export async function isSuperAdmin(): Promise<boolean> {
  const session = await getServerSession();
  if (!session) return false;
  return getCanonicalRole(session.role) === "Super Admin";
}

/**
 * Enhanced Super Admin permission checker.
 * Super Admin has all admin permissions plus additional platform-level capabilities.
 */
export async function hasSuperAdminAccess(): Promise<boolean> {
  return await isSuperAdmin();
}

/**
 * Check if user can access any school's data (Super Admin only).
 * Regular admins are restricted to their own school.
 */
export async function canAccessAnySchool(): Promise<boolean> {
  return await isSuperAdmin();
}

/**
 * Check if user can impersonate other users (Super Admin only).
 * This is an enhanced capability beyond regular admin permissions.
 */
export async function canImpersonateUsers(): Promise<boolean> {
  return await isSuperAdmin();
}

/**
 * Check if user can manage platform-level settings (Super Admin only).
 * Regular admins can only manage school-level settings.
 */
export async function canManagePlatformSettings(): Promise<boolean> {
  return await isSuperAdmin();
}

/**
 * Check if user can view all schools data (Super Admin only).
 * Regular admins can only view their own school data.
 */
export async function canViewAllSchools(): Promise<boolean> {
  return await isSuperAdmin();
}

/**
 * Check if user can manage system-wide subscriptions and billing (Super Admin only).
 */
export async function canManageSubscriptions(): Promise<boolean> {
  return await isSuperAdmin();
}

/**
 * Check if user can access audit logs (Super Admin only).
 * This is an enhanced security capability.
 */
export async function canAccessAuditLogs(): Promise<boolean> {
  return await isSuperAdmin();
}

/**
 * Check if user can manage system backups (Super Admin only).
 */
export async function canManageBackups(): Promise<boolean> {
  return await isSuperAdmin();
}

/**
 * Universal access checker for Super Admin.
 * Returns true for Super Admin regardless of the specific permission.
 * For regular admins, checks against their specific permissions.
 */
export async function hasPermission(permissionKey: string): Promise<boolean> {
  const isSA = await isSuperAdmin();
  if (isSA) return true; // Super Admin has all permissions
  
  const session = await getServerSession();
  if (!session) return false;
  
  const canonical = getCanonicalRole(session.role);
  if (canonical !== "Admin") return false;
  
  try {
    const adminRecord = await prisma.admin.findUnique({
      where: { id: session.userId },
      select: { permissions: true }
    });
    
    if (!adminRecord) return false;
    
    const permissions = (adminRecord.permissions as Record<string, boolean>) || {};
    return permissions[permissionKey] || permissions["all"] || false;
  } catch {
    return false;
  }
}

/**
 * Guards a route/action for School Admins and Super Admin.
 * Super Admin has all admin permissions by default.
 * Optionally checks for a specific granular permission for school admins.
 * If permission is denied, it throws an error or redirects.
 */
export async function guardSchoolAdmin(permissionKey?: string) {
  const session = await requireSession(["admin", "SCHOOL_ADMIN", "SUPER_ADMIN", "provider"]);
  
  const canonical = getCanonicalRole(session.role);
  
  // Super Admin bypasses all permission checks
  if (canonical === "Super Admin") {
    return session;
  }
  
  if (!session.schoolId) {
    throw new Error("Unauthorized: No school context found.");
  }

  if (permissionKey) {
    const adminRecord = await prisma.admin.findUnique({
      where: { id: session.userId },
      select: { permissions: true }
    });

    if (!adminRecord) {
      throw new Error("Unauthorized: Admin record not found.");
    }

    const permissions = (adminRecord.permissions as Record<string, boolean>) || {};
    
    // Check if they have the specific permission or the "all" wildcard permission
    if (!permissions[permissionKey] && !permissions["all"]) {
      throw new Error(`Forbidden: Missing permission '${permissionKey}'`);
    }
  }

  return session;
}

