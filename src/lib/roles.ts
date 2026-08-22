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

/** Map internal database/JWT roles to the 5 canonical platform roles (Edge-safe, zero dependencies) */
export function getCanonicalRole(role?: string | null): CanonicalRole {
  if (!role) return "Student";
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
