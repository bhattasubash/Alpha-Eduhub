# Implementation Plan

## Overview

This plan implements the SaaS School ERP bugfix following the exploratory bugfix workflow:
1. **Explore** — Write a bug condition property-based test BEFORE the fix to document and confirm every defect.
2. **Preserve** — Write preservation property tests on unfixed code to record the correct baseline.
3. **Implement** — Apply all 16 targeted changes across schema, auth helpers, server actions, list queries, Super Admin surface, and UI components.
4. **Validate** — Re-run both test suites to confirm bugs are fixed and no regressions were introduced.

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1", "2"] },
    { "wave": 2, "tasks": ["3.1"] },
    { "wave": 3, "tasks": ["3.2", "3.8"] },
    { "wave": 4, "tasks": ["3.3", "3.6", "3.9"] },
    { "wave": 5, "tasks": ["3.4"] },
    { "wave": 6, "tasks": ["3.5", "3.7"] },
    { "wave": 7, "tasks": ["3.10"] },
    { "wave": 8, "tasks": ["3.11", "3.12"] },
    { "wave": 9, "tasks": ["4"] }
  ]
}
```

## Tasks

- [ ] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Unauthorised Mutations Are Not Rejected
  - **CRITICAL**: This test MUST FAIL on unfixed code — failure confirms the bugs exist
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behaviour — it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples demonstrating the missing auth/authz guards on update/delete actions
  - **Scoped PBT Approach**: For deterministic bugs, scope to the concrete failing cases confirmed below
  - Create `src/__tests__/bugCondition.test.ts`
  - Import `updateSubject`, `deleteClass`, `updateLesson`, `createLesson`, `createParent` directly from `src/lib/actions.ts`
  - **Case 1 — Unauthenticated updateSubject**: Call `updateSubject(prevState, { id: 1, name: "X", teachers: [] })` with no `access_token` cookie set; assert result has `success: false` and `message: "Unauthorized"` — on unfixed code this passes silently (bug)
  - **Case 2 — Unauthenticated deleteClass**: Call `deleteClass(prevState, formData({ id: "1" }))` with no session; assert result has `success: false` and `message: "Unauthorized"` — on unfixed code this deletes the record (bug)
  - **Case 3 — Cross-tenant updateLesson**: Mock `getServerSession` to return a session for `schoolId = "school-B"`; call `updateLesson` targeting a lesson with `schoolId = "school-A"`; assert result has `success: false` and `message: "Forbidden"` — on unfixed code the lesson is updated (bug)
  - **Case 4 — Unknown role createLesson**: Mock `getServerSession` to return `role: "parent"` (not in current `VALID_ROLES`); call `createLesson`; assert result has `success: false` and `message: "Unauthorized"` — on unfixed code this proceeds with an unrelated error (bug)
  - **Case 5 — createParent stores wrong role**: Call `createParent` with valid data; inspect the persisted `User.role` in the DB; assert it equals `"PARENT"` — on unfixed code it is stored as `"student"` (bug)
  - **PBT sweep — all 24 update/delete actions**: Generate random valid payloads with `callerId = null` (no session); for each action assert `result.success = false` — on unfixed code all 24 pass through to the DB (bug)
  - Run test suite on UNFIXED code: `npx jest src/__tests__/bugCondition.test.ts`
  - **EXPECTED OUTCOME**: Test FAILS — all assertions above fail, confirming the bugs exist
  - Document the counterexamples found (e.g. "`updateSubject(1,'X')` mutated DB without any session")
  - Mark task complete when the test is written, run, and failures are documented
  - _Requirements: 1.1, 1.3, 1.7_

- [ ] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Valid Requests Succeed Unchanged
  - **IMPORTANT**: Follow observation-first methodology — observe real behaviour on UNFIXED code first, then write tests
  - Create `src/__tests__/preservation.test.ts`
  - **Observe on UNFIXED code (non-buggy inputs — `isBugCondition(X) = false`)**:
    - Observe: `createSubject(prevState, { name: "Math", teachers: [] })` with valid SCHOOL_ADMIN session + matching `schoolId` → returns `{ success: true }`
    - Observe: Middleware redirect — unauthenticated `GET /admin` → redirect to `/sign-in?from=/admin`
    - Observe: Teacher navigating to `/admin` → redirect to `/teacher`
    - Observe: Pagination — list query with `page=2, ITEMS_PER_PAGE=10` → returns correct slice and total count
    - Observe: Seed script `npm run seed` → completes without FK violations
  - **Write property-based tests capturing observed behaviour**:
    - `Property 2a`: For all valid SCHOOL_ADMIN sessions with matching `schoolId`, `createSubject` returns `{ success: true }` and the record appears in the DB
    - `Property 2b`: For all valid role/route combinations defined in `routeAccessMap`, authenticated users are allowed through; unauthenticated users are redirected to `/sign-in?from=<path>`
    - `Property 2c`: For all page values `p ∈ [1..N]`, the list query returns exactly `ITEMS_PER_PAGE` records (or the remainder on the last page) and the correct `count`
    - `Property 2d`: `createParent`, `createLesson`, `createExam`, `createAssignment` with valid sessions return `{ success: true }` and persist records
  - Verify all property tests PASS on UNFIXED code (establishes baseline)
  - Run: `npx jest src/__tests__/preservation.test.ts`
  - **EXPECTED OUTCOME**: Tests PASS — confirms baseline behaviour to preserve
  - Mark task complete when tests are written, run, and all are green on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10_

- [ ] 3. Fix: Multi-tenant SaaS auth guards, role model, tenant isolation, Super Admin surface, and empty/loading UI

  - [ ] 3.1 Extend Prisma schema — UserRole enum and School.status
    - Add `SUPER_ADMIN`, `SCHOOL_ADMIN`, `PARENT` to the `UserRole` enum (keep `TEACHER`, `STUDENT`, `provider` values; remove legacy lowercase `admin`, `teacher`, `student` after migration via `@map` or data migration)
    - Add `SchoolStatus` enum with values `ACTIVE` and `SUSPENDED`
    - Add `status SchoolStatus @default(ACTIVE)` field to the `School` model
    - Run `npx prisma migrate dev --name add_roles_and_school_status` to generate and apply migration
    - Run `npx prisma generate` to regenerate the Prisma client
    - _Bug_Condition: `isBugCondition(X)` where `X.callerRole NOT IN ["SUPER_ADMIN","SCHOOL_ADMIN","TEACHER","STUDENT","PARENT","provider"]` — the enum did not contain these values_
    - _Expected_Behavior: All six role values are valid enum members; `PARENT` is a recognised DB value; School records carry an `ACTIVE` or `SUSPENDED` status_
    - _Preservation: Existing seeded records with lowercase roles must be migrated or re-seeded; no FK violations after migration_
    - _Requirements: 2.3, 2.4_

  - [ ] 3.2 Update `src/lib/getRole.ts` — VALID_ROLES, requireSession, assertSchoolOwnership
    - Update `VALID_ROLES` constant to `["SUPER_ADMIN","SCHOOL_ADMIN","TEACHER","STUDENT","PARENT","provider"]`
    - Update `AppRole` type to match the new constant
    - Add `requireSession(allowedRoles?: AppRole[]): Promise<TokenPayload>` — throws `new Error("Unauthorized")` if no session exists; throws `new Error("Forbidden")` if `session.role` is not in `allowedRoles`
    - Add `assertSchoolOwnership(session: TokenPayload, targetSchoolId: string): Promise<void>` — returns early without check if `session.role === "SUPER_ADMIN"`; throws `new Error("Forbidden")` if `session.schoolId !== targetSchoolId`
    - Ensure existing `getRole()` still maps `"admin"` → `"SCHOOL_ADMIN"`, `"teacher"` → `"TEACHER"`, `"student"` → `"STUDENT"` for backward compatibility
    - _Bug_Condition: `isBugCondition(X)` where `X.callerRole NOT IN VALID_ROLES` or `X.callerSchoolId != X.targetSchoolId`_
    - _Expected_Behavior: `requireSession()` rejects unauthenticated callers; `assertSchoolOwnership()` rejects cross-tenant callers; SUPER_ADMIN bypasses the ownership check_
    - _Preservation: `getRole()` returns correct values for `provider`, `admin`, `teacher`, `student` tokens already in circulation_
    - _Requirements: 2.1, 2.3_

  - [ ] 3.3 Update `src/lib/settings.ts` — routeAccessMap with all six roles
    - Add `/super-admin(.*)` → `["SUPER_ADMIN"]` entry
    - Update `/admin(.*)` → `["SCHOOL_ADMIN"]`
    - Update `/teacher(.*)` → `["TEACHER"]`
    - Update `/student(.*)` → `["STUDENT"]`
    - Add `/parent(.*)` → `["PARENT"]`
    - Update list-page entries (e.g. `/list/teachers`, `/list/subjects`, etc.) to reference the new role names
    - _Bug_Condition: `isBugCondition(X)` where middleware mis-routes `SUPER_ADMIN` or `PARENT` due to missing route entries_
    - _Expected_Behavior: All six roles are routed to the correct dashboard; `SUPER_ADMIN` reaches `/super-admin`; `PARENT` reaches `/parent`; no role can access another role's top-level route_
    - _Preservation: Existing redirect behaviour for `provider`, `SCHOOL_ADMIN`, `TEACHER`, `STUDENT` is unchanged_
    - _Requirements: 2.3_

  - [ ] 3.4 Fix `src/lib/actions.ts` — add requireSession guard to all 24 update/delete actions
    - Import `requireSession` and `assertSchoolOwnership` from `src/lib/getRole.ts`
    - Apply the following pattern to each of the 24 actions: `updateSubject`, `deleteSubject`, `updateClass`, `deleteClass`, `updateTeacher`, `deleteTeacher`, `updateStudent`, `deleteStudent`, `updateParent`, `deleteParent`, `updateLesson`, `deleteLesson`, `updateExam`, `deleteExam`, `updateAssignment`, `deleteAssignment`, `updateResult`, `deleteResult`, `updateAttendance`, `deleteAttendance`, `updateEvent`, `deleteEvent`, `updateAnnouncement`, `deleteAnnouncement`
    - For each action: (1) call `const session = await requireSession(["SCHOOL_ADMIN","SUPER_ADMIN"])` at the top of the try block; (2) fetch the existing record from Prisma by the supplied `id`; (3) call `await assertSchoolOwnership(session, existing.schoolId)` before any Prisma write; (4) catch `Error` messages `"Unauthorized"` or `"Forbidden"` and return `{ success: false, error: true, message: err.message }` immediately
    - _Bug_Condition: `isBugCondition(X)` where `X.callerId IS NULL` OR `X.callerSchoolId != X.targetSchoolId` AND action is `update` or `delete`_
    - _Expected_Behavior: All 24 actions return `{ success: false, error: true, message: "Unauthorized" | "Forbidden" }` without executing any Prisma write when isBugCondition is true_
    - _Preservation: Valid SCHOOL_ADMIN calls with matching schoolId still complete the mutation and invoke `revalidatePath`_
    - _Requirements: 2.1, 2.7_

  - [ ] 3.5 Fix `src/lib/actions.ts` — correct createParent role and add cross-entity ownership checks
    - Change `role: "student"` → `role: "PARENT"` in `createParent` (post-enum-migration value)
    - In `createExam`: after reading session, fetch the target `Lesson` by `lessonId` and call `assertSchoolOwnership(session, lesson.schoolId)` before inserting the exam
    - Apply the same cross-entity ownership check to `createAssignment`, `createResult`, `createAttendance`, `createEvent`, `createAnnouncement` wherever a foreign-key from another entity is accepted in the input payload
    - _Bug_Condition: `isBugCondition(X)` where `createParent` stores `role: "student"`, or a cross-entity create attaches data to a record from a different school_
    - _Expected_Behavior: Parent users receive `role: "PARENT"` in the DB and subsequent JWTs; cross-entity creates are rejected with `"Forbidden"` if the referenced record belongs to a different school_
    - _Preservation: All other fields of `createParent` remain unaffected; create actions for valid same-school inputs still succeed and persist records_
    - _Requirements: 2.1, 2.3, 2.7_

  - [ ] 3.6 Fix list page Prisma queries — add schoolId filter to all findMany calls
    - Audit every `prisma.*.findMany` call in `src/app/(dashboard)/list/*/page.tsx`
    - For each query that does not already include `where: { schoolId: session.schoolId }`, add it — skip only for SUPER_ADMIN callers (who should see all schools' data)
    - Ensure `getServerSession()` (or `requireSession()`) is called at the top of each page's data-fetching function before any Prisma calls
    - Affected pages include: `teachers`, `students`, `parents`, `subjects`, `classes`, `lessons`, `exams`, `assignments`, `results`, `attendance`, `events`, `announcements`
    - _Bug_Condition: `isBugCondition(X)` where `X.callerSchoolId != X.targetSchoolId` and list queries return records belonging to all schools (defect 1.2)_
    - _Expected_Behavior: Every list query returns only records whose `schoolId` matches the caller's `schoolId` (Property 3: Tenant Isolation); SUPER_ADMIN queries are unfiltered_
    - _Preservation: Pagination (page, ITEMS_PER_PAGE, count), teacher-owned lesson filters, and student-class filters are all unchanged_
    - _Requirements: 2.2_

  - [ ] 3.7 Create Super Admin surface — layout, pages, and server actions
    - Create `src/app/(dashboard)/super-admin/layout.tsx` — Super Admin sidebar with navigation links to dashboard, schools, audit, and settings
    - Create `src/app/(dashboard)/super-admin/page.tsx` — analytics dashboard showing all-school stats
    - Create `src/app/(dashboard)/super-admin/schools/page.tsx` — table listing all schools with create/edit/delete/suspend/activate actions
    - Create `src/app/(dashboard)/super-admin/schools/[id]/page.tsx` — individual school detail page with admin creation form
    - Create `src/app/(dashboard)/super-admin/audit/page.tsx` — audit log view of all cross-school admin operations
    - Create `src/app/(dashboard)/super-admin/settings/page.tsx` — system-wide configuration settings
    - Create `src/lib/superAdminActions.ts` with server actions: `createSchool`, `updateSchool`, `deleteSchool`, `suspendSchool`, `activateSchool`, `createSchoolAdmin` — each guarded with `requireSession(["SUPER_ADMIN"])` at the top
    - _Bug_Condition: `isBugCondition(X)` where a SUPER_ADMIN user has no accessible routes, pages, or server actions (defect 1.4)_
    - _Expected_Behavior: SUPER_ADMIN can navigate to all `/super-admin/*` routes, manage schools (CRUD + suspend/activate), and execute all Super Admin server actions_
    - _Preservation: No existing routes are affected; all other roles receive a redirect or 403 when accessing `/super-admin/*`_
    - _Requirements: 2.4_

  - [ ] 3.8 Create EmptyState and TableSkeleton components; integrate into Table
    - Create `src/components/EmptyState.tsx` — renders a centred icon, heading (`title`), and message when a list has zero records; accept `icon`, `title`, and `message` props
    - Create `src/components/TableSkeleton.tsx` — renders `rows` animated placeholder `<tr>` rows with `cols` cells each using Tailwind `animate-pulse`; accept configurable `rows` (default 10) and `cols` (default 5) props
    - Update `src/components/Table.tsx` — import `EmptyState`; when `data.length === 0`, render `<EmptyState icon={...} title="No records found" message="..." />` in place of the empty `<tbody>`
    - _Bug_Condition: Table renders blank on zero rows; no skeleton or spinner components exist anywhere in the component tree (defects 1.5, 1.6)_
    - _Expected_Behavior: Zero-record lists show a professional EmptyState; tables show TableSkeleton rows while data is loading via Suspense fallback_
    - _Preservation: Table layout, column headers, sort icons, action buttons, pagination, and all non-empty rendering remain unchanged_
    - _Requirements: 2.5, 2.6_

  - [ ] 3.9 Add loading and disabled states to form components and dashboard widgets
    - In all form components under `src/components/forms/*.tsx`: use React `useFormStatus` to disable the submit button and show an inline spinner while the server action is pending
    - In dashboard widgets that fetch async data: wrap each widget with `<Suspense fallback={<WidgetSkeleton />}>` to show a skeleton until the promise resolves
    - In list page server components: wrap the data table section with `<Suspense fallback={<TableSkeleton />}>` so TableSkeleton is shown during the initial fetch
    - In client components that call server actions directly: use `useTransition` to reflect the pending state on the triggering button
    - _Bug_Condition: No loading indicators exist anywhere; the UI appears frozen during mutations and data fetches (defect 1.6)_
    - _Expected_Behavior: Submit buttons are disabled and show a spinner while pending; tables show skeleton rows while loading; widgets show skeleton placeholders during fetch_
    - _Preservation: Form submission logic, client-side validation, error rendering, and result handling are all unchanged_
    - _Requirements: 2.6_

  - [ ] 3.10 Fix TypeScript and ESLint quality issues for production build
    - Resolve all TypeScript errors introduced by enum changes: update every string literal `"admin"` → `"SCHOOL_ADMIN"`, `"teacher"` → `"TEACHER"`, `"student"` → `"STUDENT"` in type annotations, type guards, and conditional comparisons across the codebase
    - Eliminate any `any` types introduced in new helpers (`requireSession`, `assertSchoolOwnership`) and new components (`EmptyState`, `TableSkeleton`)
    - Resolve ESLint violations: unused imports, missing explicit return types on exported functions, etc.
    - Update seed scripts (`prisma/seed.ts` and `prisma/seed-dev.ts`) to use new enum values and ensure demo data for all six roles is seeded without FK violations
    - Run `npx next build` and fix any remaining errors incrementally (top to bottom in build output) until exit code is 0
    - _Bug_Condition: Production build fails with TypeScript errors and ESLint violations; `createParent` mis-stores the role (defects 1.8, 1.9)_
    - _Expected_Behavior: `npx next build` completes with zero TypeScript errors, zero ESLint errors, and exit code 0; seed scripts run cleanly_
    - _Preservation: Seed script still populates complete demo data for all roles and school-scoped entities without FK violations_
    - _Requirements: 2.8, 2.9_

  - [ ] 3.11 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Unauthorised Mutations Are Rejected
    - **IMPORTANT**: Re-run the SAME test from task 1 — do NOT write a new test
    - The test from task 1 encodes the expected behaviour; when it passes, it confirms the fix is correct for every branch of `isBugCondition(X)`
    - Run: `npx jest src/__tests__/bugCondition.test.ts`
    - **EXPECTED OUTCOME**: All assertions now PASS:
      - Unauthenticated `updateSubject` returns `{ success: false, message: "Unauthorized" }` with no DB mutation
      - Cross-tenant `updateLesson` returns `{ success: false, message: "Forbidden" }` with no DB mutation
      - Unknown-role `createLesson` returns `{ success: false, message: "Unauthorized" }`
      - `createParent` persists `User.role = "PARENT"` (not `"student"`)
      - PBT sweep: all 24 update/delete actions reject unauthenticated callers
    - _Requirements: 2.1, 2.3, 2.7_

  - [ ] 3.12 Verify preservation tests still pass
    - **Property 2: Preservation** - Valid Requests Succeed Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 — do NOT write new tests
    - Run: `npx jest src/__tests__/preservation.test.ts`
    - **EXPECTED OUTCOME**: All preservation tests still PASS (zero regressions):
      - Valid SCHOOL_ADMIN `createSubject` with matching `schoolId` still succeeds and persists the record
      - Middleware redirects still work for all existing roles
      - Pagination still returns correct page slices and accurate total counts
      - Seed script completes without errors after migration
    - Confirm zero regressions introduced by any of the fix sub-tasks


- [ ] 4. Checkpoint — Ensure all tests pass
  - Run the full test suite: `npx jest --testPathPattern="src/__tests__"` (or the configured test command)
  - Confirm `bugCondition.test.ts` passes (Property 1 exploration test now validates the fix)
  - Confirm `preservation.test.ts` passes (Property 2 preservation — no regressions)
  - Run unit tests for new helpers and components:
    - `requireSession()` — valid JWT returns session; missing/expired token throws `"Unauthorized"`
    - `assertSchoolOwnership()` — SUPER_ADMIN always passes; mismatched `schoolId` throws `"Forbidden"`; matched `schoolId` passes
    - `getRole()` — recognises all six role values; returns `null` for unknown strings
    - `isBugCondition` predicate — all five branches: unauthenticated, no school context, cross-tenant, unknown role, ownership bypass
    - `EmptyState` — renders icon, title, and message props correctly
    - `TableSkeleton` — renders the correct number of `rows` and `cols`
  - Run integration tests:
    - End-to-end CRUD as SCHOOL_ADMIN (create → read → update → delete a Subject; verify each step succeeds and `revalidatePath` fires)
    - Cross-tenant rejection (School A admin cannot delete School B class; response contains `{ success: false, message: "Forbidden" }` and the class still exists)
    - Super Admin dashboard (navigate `/super-admin`; create a school; suspend it; verify status changes in DB)
    - Parent role routing (sign in as PARENT → redirected to `/parent`; attempt to access `/admin` → redirected away)
    - Tenant isolation (as School A admin, fetch `/list/teachers`; verify zero School B teachers appear)
    - Empty-state display (school with no subjects → EmptyState rendered on `/list/subjects`)
    - Loading state display (Suspense fallback → TableSkeleton visible during fetch; form submit button shows spinner)
    - Production build: `npx next build` → exit code 0, zero TypeScript errors, zero ESLint errors
  - Ensure all tests pass; ask the user if any questions arise
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10_

## Notes

- Tasks 1 and 2 MUST be completed and run against **unfixed** code before any implementation starts in task 3.
- The test files created in tasks 1 and 2 are reused verbatim in tasks 3.11 and 3.12 — do NOT rewrite or modify them.
- Task 3.1 (Prisma schema migration) is a hard prerequisite for all other implementation sub-tasks; complete it and regenerate the client before touching `getRole.ts` or `actions.ts`.
- Task 3.10 (build fix) must be the last implementation sub-task before the validation pass in 3.11/3.12.
- All 24 update/delete actions in task 3.4 should be updated in a single commit to avoid partial states where some actions are guarded and others are not.
- When running `npx next build` in task 3.10, fix errors incrementally from the top of the build output and re-run after each batch of fixes.
- The `isBugCondition(X)` predicate from `bugfix.md` is the authoritative definition of which inputs the fix must reject; reference it when in doubt about whether a test case belongs in task 1 or task 2.
