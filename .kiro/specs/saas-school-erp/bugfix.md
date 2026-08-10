# Bugfix Requirements Document

## Introduction

The existing full-stack school management application (Next.js 14, Prisma, TypeScript) must be converted into a multi-tenant SaaS School ERP. The current system has several defects that prevent it from functioning safely and correctly as a multi-tenant product: server actions lack consistent authorization guards, the role model is incomplete (missing SUPER_ADMIN, PARENT roles and their access rules), the UI has no loading or empty states, the Super Admin management surface does not exist, and the codebase contains duplication and TypeScript quality issues. These defects allow data leakage between schools, unauthorised mutations, and a broken user experience that must all be remedied without regressing existing correctly-working behaviour.

---

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a server action (e.g., `updateSubject`, `deleteSubject`, `deleteClass`) is called THEN the system executes the mutation without verifying the caller's session, role, or school ownership, allowing unauthenticated or cross-school mutations.

1.2 WHEN a user with any role queries a list page THEN the system does not consistently filter records by `schoolId`, returning records that belong to other schools.

1.3 WHEN the application checks a user's role THEN the system only recognises `provider`, `admin`, `teacher`, and `student`, with no support for `SUPER_ADMIN` or `PARENT` roles, causing those users to be rejected or mis-routed.

1.4 WHEN a SUPER_ADMIN user is authenticated THEN the system provides no dedicated dashboard or management interface, leaving super-admin workflows completely absent.

1.5 WHEN a table renders with zero records THEN the system shows a blank area or a minimal plain-text message, lacking a professional empty-state UI.

1.6 WHEN a form is submitting, a table is loading data, a dashboard widget is fetching, or a file is uploading THEN the system shows no loading indicator, causing the UI to appear frozen or unresponsive.

1.7 WHEN a school-scoped record (Teacher, Student, Class, Subject, Lesson, Exam, Assignment, Result, Attendance, Event, Announcement) is created or updated THEN some server actions do not attach or verify `schoolId`, risking cross-tenant data pollution.

1.8 WHEN the codebase is compiled THEN the system contains TypeScript errors, ESLint violations, duplicated component logic, and non-modular folder organisation that cause build failures and maintainability problems.

1.9 WHEN the application is built for production THEN it fails or emits errors because of the above quality issues, making it undeployable.

---

### Expected Behavior (Correct)

2.1 WHEN any server action that mutates data is called THEN the system SHALL verify the caller has a valid session, check the caller's role against the required permission, and confirm the target record's `schoolId` matches the caller's `schoolId` (or allow access if the caller is SUPER_ADMIN) before executing the mutation.

2.2 WHEN a user queries any list page or dashboard THEN the system SHALL automatically filter all Prisma queries with `WHERE schoolId = session.schoolId`, except for SUPER_ADMIN users who SHALL receive unfiltered results spanning all schools.

2.3 WHEN the application checks a user's role THEN the system SHALL recognise and correctly route all six roles: `SUPER_ADMIN`, `SCHOOL_ADMIN` (previously `admin`), `TEACHER`, `STUDENT`, `PARENT`, and the platform-level `provider`, applying the correct access rules for each.

2.4 WHEN a SUPER_ADMIN user authenticates THEN the system SHALL present a dedicated Super Admin dashboard that supports: creating, editing, deleting, suspending, and activating schools; creating school admins; viewing all schools and analytics; managing subscriptions; viewing audit logs; and configuring system settings.

2.5 WHEN a table has zero records to display THEN the system SHALL render a professional empty-state component (icon, heading, and contextual message) in place of the table body.

2.6 WHEN a form is being submitted, a table is loading, a dashboard widget is fetching, or a file is uploading THEN the system SHALL display appropriate loading indicators (skeleton loaders for tables/widgets, spinner or disabled state for forms and upload buttons).

2.7 WHEN any school-scoped record is created or updated via a server action THEN the system SHALL attach `schoolId` from the caller's verified session to the record and reject the request if `schoolId` is absent or mismatched.

2.8 WHEN the codebase is compiled THEN the system SHALL produce zero TypeScript errors, zero ESLint errors, use clean architecture with SOLID principles, reusable components, a modular folder structure, and no duplicated logic.

2.9 WHEN a production build is executed THEN the system SHALL complete successfully, and all CRUD operations, authentication flows, role-permission checks, dashboard widgets, and file uploads SHALL be verified to work correctly after running Prisma migration, client generation, and seed.

---

### Unchanged Behavior (Regression Prevention)

3.1 WHEN an authenticated `admin` (SCHOOL_ADMIN) user accesses any list page THEN the system SHALL CONTINUE TO display, create, update, and delete records scoped to that admin's school.

3.2 WHEN an authenticated `teacher` user accesses assignments, exams, lessons, or attendance THEN the system SHALL CONTINUE TO filter records to only those lessons the teacher owns.

3.3 WHEN an authenticated `student` user accesses assignments, exams, results, or attendance THEN the system SHALL CONTINUE TO filter records to only those belonging to that student's class and their own records.

3.4 WHEN a user submits a valid form (create or update) THEN the system SHALL CONTINUE TO persist the record to the database and revalidate the relevant list path.

3.5 WHEN a user performs a delete action on a record they own THEN the system SHALL CONTINUE TO remove the record and revalidate the relevant list path.

3.6 WHEN an unauthenticated user navigates to a protected route THEN the system SHALL CONTINUE TO redirect them to the `/sign-in` page with the original path preserved as a query parameter.

3.7 WHEN a user navigates to a route outside their role's access map THEN the system SHALL CONTINUE TO redirect them to their own role-appropriate dashboard.

3.8 WHEN a user uploads a file (e.g., profile image) THEN the system SHALL CONTINUE TO handle the upload via Cloudinary and persist the resulting URL.

3.9 WHEN pagination is used on a list page THEN the system SHALL CONTINUE TO return the correct page of results with accurate total count.

3.10 WHEN the seed script is run THEN the system SHALL CONTINUE TO populate demo data for all roles and school-scoped entities without errors.

---

## Bug Condition Pseudocode

### Bug Condition Function

```pascal
FUNCTION isBugCondition(X)
  INPUT: X of type ServerRequest { action, callerId, callerRole, callerSchoolId, targetSchoolId }
  OUTPUT: boolean

  // Triggers the bug when auth/authz guards are missing or incomplete
  RETURN (
    X.callerId IS NULL                                          // unauthenticated call
    OR X.callerSchoolId IS NULL AND X.callerRole != "SUPER_ADMIN"  // school-less non-super call
    OR (X.callerSchoolId != X.targetSchoolId AND X.callerRole != "SUPER_ADMIN")  // cross-tenant access
    OR X.callerRole NOT IN ["SUPER_ADMIN","SCHOOL_ADMIN","TEACHER","STUDENT","PARENT","provider"]  // unknown role
    OR X.action IN ["update","delete"] AND NOT ownsRecord(X.callerId, X.targetRecordId)  // ownership bypass
  )
END FUNCTION
```

### Fix Checking Property

```pascal
// Property: Fix Checking — all buggy inputs must now be rejected
FOR ALL X WHERE isBugCondition(X) DO
  result ← serverAction'(X)
  ASSERT result.success = false
    AND result.error = true
    AND result.message IN ["Unauthorized", "Forbidden"]
    AND NO database mutation occurred
END FOR
```

### Preservation Property

```pascal
// Property: Preservation Checking — valid requests must still succeed
FOR ALL X WHERE NOT isBugCondition(X) DO
  ASSERT serverAction(X) = serverAction'(X)   // same outcome before and after fix
END FOR
```
