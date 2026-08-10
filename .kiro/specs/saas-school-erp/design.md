# SaaS School ERP — Bugfix Design

## Overview

The existing school management application (Next.js 14, Prisma, TypeScript) is a single-tenant
system being promoted to a multi-tenant SaaS product. Multiple intersecting defects prevent
this promotion from being safe or correct:

1. **Missing auth guards on update/delete server actions** — `updateSubject`, `deleteSubject`,
   `updateClass`, `deleteClass`, `updateTeacher`, `deleteTeacher`, `updateStudent`,
   `deleteStudent`, `updateParent`, `deleteParent`, `updateLesson`, `deleteLesson`,
   `updateExam`, `deleteExam`, `updateAssignment`, `deleteAssignment`, `updateResult`,
   `deleteResult`, `updateAttendance`, `deleteAttendance`, `updateEvent`, `deleteEvent`,
   `updateAnnouncement`, `deleteAnnouncement` — all execute mutations without calling
   `getSession()`, making them accessible to unauthenticated callers and cross-tenant
   callers alike.

2. **Missing `schoolId` filter on Prisma list queries** — pages across the dashboard
   return records from all schools rather than scoping to `session.schoolId`.

3. **Incomplete role model** — `src/lib/getRole.ts` only recognises `provider`, `admin`,
   `teacher`, `student`; `SUPER_ADMIN` and `PARENT` (and their enum values `SCHOOL_ADMIN`,
   `parent`) are absent from `VALID_ROLES` and `routeAccessMap`.

4. **No SUPER_ADMIN surface** — there is no route, layout, dashboard, or server action
   for the platform super-admin user.

5. **No empty-state or loading UI** — tables render blank on zero rows; no skeletons
   or spinners exist anywhere in the component tree.

6. **TypeScript / ESLint quality** — `UserRole` enum in the Prisma schema still uses
   lowercase legacy values; `createParent` incorrectly stores `role: "student"` for
   parent users; several update/delete actions are missing session guards entirely.

The fix strategy is: **add a thin, reusable auth/authz guard layer** applied uniformly
to every server action; **scope all Prisma reads to `session.schoolId`**; **extend the
role model**; **build a Super Admin surface**; and **add empty-state and loading
components**. The production build must succeed with zero TypeScript and ESLint errors.

---

## Glossary

- **Bug\_Condition (C)**: The condition that makes a server request dangerous — missing
  session, missing school scope, cross-tenant mismatch, unrecognised role, or unauthorised
  ownership action.
- **Property (P)**: The desired outcome when the bug condition holds — the request is
  **rejected** with `{ success: false, error: true, message: "Unauthorized" | "Forbidden" }`
  and **no database mutation occurs**.
- **Preservation**: All currently working, correctly-guarded paths (e.g., `createSubject`
  which already calls `getSession()`) must continue to succeed exactly as before.
- **`isBugCondition(X)`**: Pseudocode predicate that identifies a defective request.
- **`serverAction(X)` / `serverAction'(X)`**: The original (unfixed) and fixed server
  action functions respectively.
- **`getSession()`**: `src/lib/getRole.ts → getSession()` — reads and verifies the JWT
  access token from the httpOnly cookie; returns `TokenPayload | null`.
- **`assertOwnership(session, recordId)`**: Proposed helper that verifies the target
  record's `schoolId` equals `session.schoolId` (bypassed for `SUPER_ADMIN`).
- **`schoolId`**: The multi-tenancy key attached to every school-scoped record.
- **`SUPER_ADMIN`**: Platform-level role with cross-school read/write access.
- **`SCHOOL_ADMIN`**: School-scoped administrator (maps to the current `admin` role).
- **`PARENT`**: New role for parent users (currently mis-stored as `student` in the DB).
- **Skeleton loader**: A CSS/Tailwind animated placeholder shown while data is fetching.
- **Empty-state component**: A reusable UI block (icon + heading + message) shown when
  a list query returns zero records.

---

## Bug Details

### Bug Condition

The bug manifests whenever a server action is invoked without a valid authenticated
session, without a school scope that matches the target record, or with an unrecognised
role. In the current codebase, every `update*` and `delete*` action omits the
`getSession()` call entirely, and several `create*` actions omit the role validation
step, creating multiple entry points for unauthenticated or cross-tenant mutations.

**Formal Specification:**

```
FUNCTION isBugCondition(X)
  INPUT: X of type ServerRequest {
    action,          // "create" | "update" | "delete"
    callerId,        // User.id from JWT, or null if unauthenticated
    callerRole,      // role string from JWT, or null
    callerSchoolId,  // schoolId from JWT, or null
    targetSchoolId,  // schoolId of the record being mutated
    targetRecordId   // PK of the record being mutated
  }
  OUTPUT: boolean

  RETURN (
    X.callerId IS NULL                                              // unauthenticated
    OR (X.callerSchoolId IS NULL
        AND X.callerRole != "SUPER_ADMIN")                         // no school context
    OR (X.callerSchoolId != X.targetSchoolId
        AND X.callerRole != "SUPER_ADMIN")                         // cross-tenant
    OR X.callerRole NOT IN [
        "SUPER_ADMIN","SCHOOL_ADMIN","TEACHER",
        "STUDENT","PARENT","provider"]                             // unknown role
    OR (X.action IN ["update","delete"]
        AND NOT ownsRecord(X.callerSchoolId, X.targetRecordId))    // ownership bypass
  )
END FUNCTION
```

### Concrete Examples of Bug Manifestation

| Scenario | Caller | Action | Current outcome | Expected outcome |
|---|---|---|---|---|
| No cookie / expired JWT | — | `updateSubject({ id:1, name:"Math" })` | Subject updated ✓ | Rejected: "Unauthorized" |
| School B admin targets School A record | `callerSchoolId="school-B"`, `targetSchoolId="school-A"` | `deleteClass` | Class deleted ✓ | Rejected: "Forbidden" |
| Role `parent` (not in `VALID_ROLES`) | `callerRole="parent"` | `createLesson` | Proceeds as if unauthenticated | Rejected: "Unauthorized" |
| Unauthenticated call | `callerId=null` | `deleteStudent` | Student deleted ✓ | Rejected: "Unauthorized" |
| Valid admin, own school | `callerSchoolId="school-A"`, `targetSchoolId="school-A"` | `updateSubject` | *(would succeed after fix)* | Succeeds |

---

## Expected Behavior

### Preservation Requirements

**Unchanged behaviors:**

- `createSubject`, `createClass`, `createTeacher`, `createStudent`, `createParent`,
  `createLesson`, `createExam`, `createAssignment`, `createResult`, `createAttendance`,
  `createEvent`, `createAnnouncement` — all already call `getSession()` and must
  continue to succeed for valid, school-scoped callers.
- Middleware route protection (`/admin(.*)`, `/teacher(.*)`, `/student(.*)`, etc.) must
  continue to redirect unauthorised roles to their own dashboards.
- Unauthenticated users navigating to protected routes must continue to be redirected
  to `/sign-in?from=<path>`.
- Pagination on list pages must continue to return correct page slices and total counts.
- Cloudinary file upload flow must remain unaffected.
- The seed script must continue to run without errors.

**Scope:**
All requests that satisfy `NOT isBugCondition(X)` — i.e., authenticated calls from a
known role with a matching `schoolId` targeting their own school's records — must
produce **exactly the same** database outcome and path revalidation as before the fix.

> **Note:** The authoritative definition of the correct post-fix behavior for buggy
> inputs is given in the Correctness Properties section (Property 1). This section
> focuses exclusively on what must NOT change.

---

## Hypothesized Root Cause

Based on direct inspection of `src/lib/actions.ts` and `src/lib/getRole.ts`:

1. **`getSession()` omitted from all update/delete actions** — Every `update*` and
   `delete*` action in `actions.ts` goes directly to the Prisma call without
   `const session = await getSession()`. The `create*` actions were retrofitted with
   session checks but the update/delete twins were never updated. This is the primary
   root cause of defects 1.1 and 1.7.

2. **No `schoolId` ownership check even where session is read** — Several `create*`
   actions read the session to obtain `schoolId` but do not verify that the related
   entities (e.g., the `lessonId` passed to `createExam`) belong to the same school.
   An attacker could pass a `lessonId` from a different school and attach the new
   exam to it. This is the root cause of defect 1.7 (partial).

3. **`VALID_ROLES` and `routeAccessMap` out of sync with the new schema** —
   `getRole.ts` exports `VALID_ROLES = ["provider","admin","teacher","student"]`. The
   Prisma `UserRole` enum still uses these lowercase values; there is no `SUPER_ADMIN`,
   `SCHOOL_ADMIN`, or `PARENT` variant. The middleware and role checks therefore reject
   or mis-handle any token carrying these new role strings. Root cause of defects 1.3
   and 1.4.

4. **No Super Admin route/layout/dashboard exists** — There is no
   `src/app/(dashboard)/super-admin/` directory, no menu entries, and no server actions
   for cross-school management operations. Root cause of defect 1.4.

5. **No empty-state or loading components** — `src/components/Table.tsx` renders a
   plain `<tbody>` with no fallback for empty arrays. No skeleton or spinner components
   exist in `src/components/`. Root cause of defects 1.5 and 1.6.

6. **`createParent` stores `role: "student"`** — The parent user is saved to the `User`
   table with `role: "student"` because `PARENT` is not yet a valid enum value. This
   means parents receive student-level JWT claims and will be routed to the student
   dashboard. Root cause of defect 1.3 (partial).

---

## Correctness Properties

Property 1: Bug Condition — Unauthorised Mutations Are Rejected

_For any_ server request `X` where `isBugCondition(X)` returns `true`, the fixed server
action `serverAction'(X)` SHALL return `{ success: false, error: true, message: "Unauthorized" | "Forbidden" }` and SHALL NOT execute any Prisma write or delete
operation, ensuring no database mutation occurs for unauthenticated, cross-tenant, or
ownership-violating calls.

**Validates: Requirements 2.1, 2.2, 2.3, 2.7**

---

Property 2: Preservation — Valid Requests Succeed Unchanged

_For any_ server request `X` where `isBugCondition(X)` returns `false` (i.e., the caller
is authenticated, has a known role, their `schoolId` matches the target record's
`schoolId`, and they own or are authorised to act on the record), the fixed server action
`serverAction'(X)` SHALL produce **exactly the same** database outcome, path
revalidation, and return value as the original `serverAction(X)`, preserving all
existing CRUD, authentication, role-routing, pagination, upload, and seed behaviour.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10**

---

Property 3: Tenant Isolation — List Queries Are School-Scoped

_For any_ authenticated user `U` with `callerRole != "SUPER_ADMIN"` and
`callerSchoolId = S`, every Prisma list query executed on their behalf SHALL include
`WHERE schoolId = S`, so that records belonging to any school `S' ≠ S` are never
returned to `U`.

**Validates: Requirements 2.2**

---

Property 4: Role Completeness — All Six Roles Are Recognised

_For any_ JWT token carrying a `role` value in
`{ "SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT", "PARENT", "provider" }`,
the fixed `getRole()` and middleware SHALL correctly identify the role, apply the
matching access rules, and route the user to the appropriate dashboard without
rejection or mis-routing.

**Validates: Requirements 2.3**

---

## Fix Implementation

### Changes Required

Assuming the root cause analysis above is correct, the following targeted changes are
needed:

---

**File:** `prisma/schema.prisma`

**Change 1 — Extend `UserRole` enum:**
Add `SUPER_ADMIN`, `SCHOOL_ADMIN`, `PARENT` values to the `UserRole` enum (keeping
existing lowercase values for backward-compat during migration, or replacing them with
a new migration).

```
enum UserRole {
  SUPER_ADMIN
  SCHOOL_ADMIN    // replaces "admin"
  TEACHER         // replaces "teacher"
  STUDENT         // replaces "student"
  PARENT          // new
  provider        // platform-level, kept as-is
}
```

**Change 2 — Add `School.status` field** (for Super Admin suspend/activate):
```
model School {
  ...
  status    SchoolStatus @default(ACTIVE)
}
enum SchoolStatus { ACTIVE SUSPENDED }
```

---

**File:** `src/lib/getRole.ts`

**Change 3 — Update `VALID_ROLES` and `AppRole`:**
```typescript
export const VALID_ROLES = [
  "SUPER_ADMIN","SCHOOL_ADMIN","TEACHER","STUDENT","PARENT","provider"
] as const;
export type AppRole = (typeof VALID_ROLES)[number];
```

**Change 4 — Add `requireSession()` guard helper:**
```typescript
export async function requireSession(
  allowedRoles?: AppRole[]
): Promise<TokenPayload> {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");
  if (allowedRoles && !allowedRoles.includes(session.role as AppRole))
    throw new Error("Forbidden");
  return session;
}
```

**Change 5 — Add `assertSchoolOwnership()` helper:**
```typescript
export async function assertSchoolOwnership(
  session: TokenPayload,
  targetSchoolId: string
): Promise<void> {
  if (session.role === "SUPER_ADMIN") return; // bypass for super admin
  if (session.schoolId !== targetSchoolId)
    throw new Error("Forbidden");
}
```

---

**File:** `src/lib/settings.ts`

**Change 6 — Add new roles and Super Admin route to `routeAccessMap`:**
```typescript
export const routeAccessMap = {
  "/super-admin(.*)": ["SUPER_ADMIN"],
  "/provider(.*)":    ["provider"],
  "/admin(.*)":       ["SCHOOL_ADMIN"],
  "/teacher(.*)":     ["TEACHER"],
  "/student(.*)":     ["STUDENT"],
  "/parent(.*)":      ["PARENT"],
  // list pages updated to use new role names …
};
```

---

**File:** `src/lib/actions.ts`

**Change 7 — Add `requireSession()` guard to every `update*` and `delete*` action:**

Apply the following pattern to all 24 update/delete actions that currently lack it:

```typescript
export const updateSubject = async (
  currentState: CurrentState, data: SubjectSchema,
): Promise<CurrentState> => {
  try {
    const session = await requireSession(["SCHOOL_ADMIN", "SUPER_ADMIN"]);
    // For SCHOOL_ADMIN: verify subject belongs to session.schoolId
    const existing = await prisma.subject.findUnique({ where: { id: data.id } });
    if (!existing) return { success: false, error: true, message: "Not found." };
    await assertSchoolOwnership(session, existing.schoolId);
    // … proceed with update
  } catch (err: unknown) {
    if (err instanceof Error &&
        (err.message === "Unauthorized" || err.message === "Forbidden"))
      return { success: false, error: true, message: err.message };
    console.error("[updateSubject]", err);
    return { success: false, error: true, message: "Failed to update subject." };
  }
};
```

The same pattern applies to: `deleteSubject`, `updateClass`, `deleteClass`,
`updateTeacher`, `deleteTeacher`, `updateStudent`, `deleteStudent`, `updateParent`,
`deleteParent`, `updateLesson`, `deleteLesson`, `updateExam`, `deleteExam`,
`updateAssignment`, `deleteAssignment`, `updateResult`, `deleteResult`,
`updateAttendance`, `deleteAttendance`, `updateEvent`, `deleteEvent`,
`updateAnnouncement`, `deleteAnnouncement`.

**Change 8 — Fix `createParent` role value:**
Change `role: "student"` → `role: "PARENT"` (after enum migration).

**Change 9 — Add `schoolId` ownership check to cross-entity `create*` actions:**
When `createExam` receives a `lessonId`, verify `lesson.schoolId === session.schoolId`
before inserting. Apply similarly to `createAssignment`, `createResult`,
`createAttendance`, `createEvent`, `createAnnouncement` where a foreign key from
another entity is accepted.

---

**File:** `src/app/(dashboard)/super-admin/` (new directory)

**Change 10 — Create Super Admin dashboard and management pages:**
- `layout.tsx` — Super Admin sidebar and nav.
- `page.tsx` — Analytics dashboard (all-school stats).
- `schools/page.tsx` — CRUD for School records.
- `schools/[id]/page.tsx` — Individual school detail + admin creation.
- `audit/page.tsx` — Audit log view.
- `settings/page.tsx` — System settings.

---

**File:** `src/lib/superAdminActions.ts` (new file)

**Change 11 — Super Admin server actions:**
`createSchool`, `updateSchool`, `deleteSchool`, `suspendSchool`, `activateSchool`,
`createSchoolAdmin` — all guarded with `requireSession(["SUPER_ADMIN"])`.

---

**File:** `src/components/EmptyState.tsx` (new file)

**Change 12 — EmptyState component:**
```tsx
export function EmptyState({ icon, title, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
      {icon}
      <h3 className="font-semibold text-gray-500 text-lg">{title}</h3>
      <p className="text-sm">{message}</p>
    </div>
  );
}
```

---

**File:** `src/components/TableSkeleton.tsx` (new file)

**Change 13 — Skeleton loader for table rows:**
```tsx
export function TableSkeleton({ rows = 10, cols = 5 }: TableSkeletonProps) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="p-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
```

---

**File:** `src/components/Table.tsx`

**Change 14 — Integrate `EmptyState` when data array is empty:**
Wrap the existing `<tbody>` mapping to render `<EmptyState>` when
`data.length === 0`.

---

**File:** `src/components/forms/*.tsx` and dashboard widgets

**Change 15 — Add loading/disabled state to form submit buttons and widgets:**
Use React `useTransition` / `useFormStatus` to disable the submit button and show a
spinner while the server action is in-flight. Wrap async dashboard widgets in
`<Suspense fallback={<WidgetSkeleton />}>`.

---

**File:** `src/lib/prisma.ts` (or query layer)

**Change 16 — List query audit:**
Review and add `where: { schoolId: session.schoolId }` to every `prisma.*.findMany`
that does not already carry it, across all list page files in
`src/app/(dashboard)/list/*/page.tsx`.

---

## Testing Strategy

### Validation Approach

Testing follows a two-phase approach:
1. **Exploratory phase** — run tests against the **unfixed** code to surface concrete
   counterexamples and confirm or refute root cause hypotheses.
2. **Fix + Preservation phase** — after applying the fix, run all tests to confirm
   buggy inputs are now rejected and valid inputs still succeed.

---

### Exploratory Bug Condition Checking

**Goal:** Surface counterexamples demonstrating the bug on unfixed code. Confirm root
causes 1–6 above, or revise if unexpected.

**Test Plan:** Write integration-style tests that invoke server actions directly with
crafted `ServerRequest` payloads. Run against the codebase with no session cookie set.

**Test Cases:**

1. **Unauthenticated `updateSubject`** — Call `updateSubject` with `{ id: 1, name: "X" }`
   and no `access_token` cookie. Expected on unfixed code: subject is updated (bug).
   Expected after fix: `{ success: false, error: true, message: "Unauthorized" }`.

2. **Unauthenticated `deleteClass`** — Call `deleteClass` with `formData.get("id")="1"`.
   Expected on unfixed code: class is deleted (bug). Expected after fix: rejected.

3. **Cross-tenant `updateLesson`** — Authenticate as School B admin; call `updateLesson`
   targeting a lesson with `schoolId = "school-A"`. Expected on unfixed: lesson
   updated (bug). Expected after fix: `{ success: false, error: true, message: "Forbidden" }`.

4. **Unknown role `createLesson`** — Forge a JWT with `role: "parent"` (not in
   `VALID_ROLES`). Call `createLesson`. Expected on unfixed: proceeds or fails with
   unrelated error. Expected after fix: rejected: "Unauthorized".

5. **`createParent` role mismatch** — Call `createParent` and inspect the persisted
   `User.role`. Expected on unfixed: `"student"`. Expected after fix: `"PARENT"`.

6. **List page cross-tenant leak** — As School B admin, fetch `/list/teachers`. Expected
   on unfixed: teachers from all schools returned (bug). Expected after fix: only
   School B teachers.

**Expected Counterexamples:**
- `updateSubject` and all other `update*`/`delete*` actions succeed without any session.
- Prisma writes cross school boundaries.
- `/list/*` pages return records from wrong schools.
- Parent users receive student-role JWTs.

---

### Fix Checking

**Goal:** Verify that for all inputs where `isBugCondition(X)` holds, the fixed actions
return the appropriate error response with no database side-effect.

**Pseudocode:**
```
FOR ALL X WHERE isBugCondition(X) DO
  result := serverAction'(X)
  ASSERT result.success = false
  ASSERT result.error = true
  ASSERT result.message IN ["Unauthorized", "Forbidden"]
  ASSERT NO database mutation occurred   // verify via follow-up SELECT
END FOR
```

---

### Preservation Checking

**Goal:** Verify that for all inputs where `NOT isBugCondition(X)`, the fixed actions
produce the same database outcome as before.

**Pseudocode:**
```
FOR ALL X WHERE NOT isBugCondition(X) DO
  ASSERT serverAction(X) = serverAction'(X)
END FOR
```

**Testing Approach:** Property-based testing is recommended because:
- It generates a large, varied space of valid payloads automatically.
- It catches unexpected regressions in edge cases (e.g., optional fields, unusual
  `schoolId` formats, max-length strings).
- It provides strong guarantees that every valid input still succeeds.

**Test Cases:**

1. **Valid admin creates subject** — Provide an authenticated `SCHOOL_ADMIN` session
   with matching `schoolId`. Verify `createSubject` still succeeds and the record
   appears in the DB.

2. **Valid admin updates subject they own** — Provide an authenticated `SCHOOL_ADMIN`
   session; target a subject whose `schoolId` matches. Verify update succeeds.

3. **Pagination still correct** — Run list queries with various `page` values; verify
   correct slicing and total count regardless of the new school filter.

4. **Seed script completes without errors** — Run `npm run seed` after migration;
   verify all demo data for all roles is created and no FK violations occur.

5. **Middleware continues to redirect** — Unauthenticated navigation to `/admin`
   redirects to `/sign-in?from=/admin`; teacher navigating to `/admin` redirects to
   `/teacher`.

---

### Unit Tests

- Test `requireSession()` returns session for valid JWT; throws "Unauthorized" for
  missing/expired token.
- Test `assertSchoolOwnership()` passes for SUPER_ADMIN regardless of `targetSchoolId`;
  throws "Forbidden" for mismatched school; passes for matched school.
- Test `getRole()` recognises all six role values; returns `null` for unknown strings.
- Test `isBugCondition` predicate against all branches (unauthenticated, no school,
  cross-tenant, unknown role, ownership bypass).
- Test `EmptyState` renders icon + title + message correctly.
- Test `TableSkeleton` renders correct number of rows and columns.

---

### Property-Based Tests

- **Property 1 (Bug Condition):** Generate random `ServerRequest` values where
  `isBugCondition(X)` is `true`; for each, invoke the fixed server action and assert
  `result.success = false` and no DB mutation occurred.
- **Property 2 (Preservation):** Generate random valid `ServerRequest` values where
  `NOT isBugCondition(X)`; assert `serverAction(X) = serverAction'(X)` for outcome
  and DB state.
- **Property 3 (Tenant Isolation):** Generate random `schoolId` pairs `(S1, S2)` with
  `S1 ≠ S2`; query the list endpoint as `S1`; assert zero records with `schoolId = S2`
  appear in results.
- **Property 4 (Role Completeness):** For each role in
  `{ SUPER_ADMIN, SCHOOL_ADMIN, TEACHER, STUDENT, PARENT, provider }`, generate a
  valid JWT and assert `getRole()` returns the expected value.

---

### Integration Tests

- **End-to-end CRUD as SCHOOL_ADMIN** — Sign in as school admin; create, read, update,
  delete a Subject; verify each step succeeds and revalidation fires.
- **Cross-tenant rejection end-to-end** — Sign in as School A admin; attempt to delete
  a Class from School B via direct `fetch` to the server action; verify 200 response
  carries `{ success: false, message: "Forbidden" }` and the class still exists.
- **Super Admin dashboard** — Sign in as `SUPER_ADMIN`; navigate to `/super-admin`;
  verify the school list loads; create a new school; suspend it; verify status changes.
- **Parent role routing** — Sign in as a newly created `PARENT` user; verify redirect
  to `/parent` dashboard; verify `/admin` is inaccessible.
- **Empty-state display** — Seed a school with no subjects; navigate to
  `/list/subjects`; verify `EmptyState` component is rendered.
- **Loading state display** — Navigate to a list page before data resolves (mock slow
  network); verify skeleton rows are visible.
- **Production build** — Run `next build`; verify exit code 0, zero TypeScript errors,
  zero ESLint errors.
