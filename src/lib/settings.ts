export const ITEM_PER_PAGE = 10;

/**
 * Maps URL path patterns (regex strings) to the roles allowed to access them.
 * Enforced in src/middleware.ts — more specific routes should come first.
 *
 * Roles: SUPER_ADMIN | provider | admin | SCHOOL_ADMIN | teacher | TEACHER | student | STUDENT | PARENT
 */
export const routeAccessMap: Record<string, string[]> = {
  // Super Admin dashboard (platform owner — full access including all admin routes)
  "/super-admin(.*)": ["SUPER_ADMIN"],

  // Role dashboards - SUPER_ADMIN has access to all dashboards
  "/provider(.*)": ["provider", "SUPER_ADMIN"],
  "/admin(.*)":    ["admin", "SCHOOL_ADMIN", "SUPER_ADMIN"],
  "/teacher(.*)":  ["teacher", "TEACHER", "admin", "SCHOOL_ADMIN", "SUPER_ADMIN"],
  "/student(.*)":  ["student", "STUDENT", "SUPER_ADMIN"],
  "/parent(.*)":   ["PARENT", "SUPER_ADMIN"],

  // List pages — admin management
  "/list/teachers":     ["admin", "SCHOOL_ADMIN", "provider", "SUPER_ADMIN"],
  "/list/students":     ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER", "provider", "SUPER_ADMIN"],
  "/list/parents":      ["admin", "SCHOOL_ADMIN", "provider", "SUPER_ADMIN"],
  "/list/subjects":     ["admin", "SCHOOL_ADMIN", "SUPER_ADMIN"],
  "/list/classes":      ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER", "SUPER_ADMIN"],
  "/list/lessons":      ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER", "SUPER_ADMIN"],
  "/list/fees":         ["admin", "SCHOOL_ADMIN", "SUPER_ADMIN"],

  // List pages — shared
  "/list/exams":         ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER", "student", "STUDENT", "SUPER_ADMIN"],
  "/list/assignments":   ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER", "student", "STUDENT", "SUPER_ADMIN"],
  "/list/results":       ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER", "student", "STUDENT", "SUPER_ADMIN"],
  "/list/attendance":    ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER", "student", "STUDENT", "SUPER_ADMIN"],
  "/list/events":        ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER", "student", "STUDENT", "SUPER_ADMIN"],
  "/list/messages":      ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER", "student", "STUDENT", "SUPER_ADMIN"],
  "/list/announcements": ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER", "student", "STUDENT", "SUPER_ADMIN"],

  // Profile / settings - SUPER_ADMIN has full access
  "/profile":  ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER", "student", "STUDENT", "SUPER_ADMIN"],
  "/settings": ["admin", "SCHOOL_ADMIN", "SUPER_ADMIN"],
};
