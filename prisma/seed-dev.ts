/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║           DEV / DEMO SEED — LOCAL DEVELOPMENT ONLY              ║
 * ║                                                                  ║
 * ║  Creates four demo accounts so you can log in immediately       ║
 * ║  and test every role without manually creating users.           ║
 * ║                                                                  ║
 * ║  Uses the SAME JWT auth flow as real users:                     ║
 * ║    • Passwords hashed with bcrypt (cost 12)                     ║
 * ║    • Roles enforced via routeAccessMap + JWT middleware          ║
 * ║    • schoolId FK wired correctly for multi-tenant isolation      ║
 * ║                                                                  ║
 * ║  ⚠  DO NOT run this seed in production.                         ║
 * ║     Remove or gate it behind NODE_ENV checks before deploy.     ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * Run:   npx tsx prisma/seed-dev.ts
 *    or: npm run seed:dev
 *
 * Re-seed any time — all upserts are idempotent.
 * To remove demo accounts before production:
 *   DELETE FROM "User" WHERE email LIKE '%@example.com';
 */

import fs from "fs";
import path from "path";

// Load .env.local or .env if DATABASE_URL is missing
if (!process.env.DATABASE_URL) {
  for (const envFile of [".env.local", ".env"]) {
    const envPath = path.resolve(process.cwd(), envFile);
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, "utf8").split("\n");
      for (const line of lines) {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*"?([^"#\r\n]*)"?/);
        if (match && !process.env[match[1]]) {
          process.env[match[1]] = match[2];
        }
      }
    }
  }
}

import { PrismaClient, UserSex } from "@prisma/client";
import bcrypt from "bcryptjs";

// ─── Safety guard ─────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === "production") {
  console.error("❌  Refusing to run dev seed in production.");
  process.exit(1);
}

const prisma = new PrismaClient();

// ─── Demo school (shared by all school-scoped demo accounts) ─────────────────
const DEMO_SCHOOL_ID = "school-dev-demo-001";

// ─── Demo credentials (edit here if you want different passwords) ─────────────
const DEMO_ACCOUNTS = {
  provider: {
    username:  "demo_provider",
    email:     "provider@example.com",
    password:  "Provider@123!",
    role:      "provider" as const,
    schoolId:  null,               // provider is not scoped to a school
  },
  admin: {
    username:  "demo_admin",
    email:     "admin@example.com",
    password:  "Admin@123!",
    role:      "admin" as const,
    schoolId:  DEMO_SCHOOL_ID,
  },
  teacher: {
    username:  "demo_teacher",
    email:     "teacher@example.com",
    password:  "Teacher@123!",
    role:      "teacher" as const,
    schoolId:  DEMO_SCHOOL_ID,
  },
  student: {
    username:  "demo_student",
    email:     "student@example.com",
    password:  "Student@123!",
    role:      "student" as const,
    schoolId:  DEMO_SCHOOL_ID,
  },
} as const;

async function main() {
  console.log("\n🛠   DEV SEED — creating demo accounts…\n");

  // ── 0. Super Admin (platform-level, no school) ─────────────────────────────
  {
    const hash = await bcrypt.hash("SuperAdmin@123!", 12);
    await prisma.user.upsert({
      where:  { email: "superadmin@example.com" },
      update: { passwordHash: hash },
      create: {
        username:     "demo_superadmin",
        email:        "superadmin@example.com",
        passwordHash: hash,
        role:         "SUPER_ADMIN",
        schoolId:     null,
      },
    });
    console.log("✅  Super Admin → superadmin@example.com");
  }

  // ── 1. Ensure the demo school exists ────────────────────────────────────────
  const school = await prisma.school.upsert({
    where:  { id: DEMO_SCHOOL_ID },
    update: {},
    create: {
      id:      DEMO_SCHOOL_ID,
      name:    "Demo Academy (Dev)",
      address: "1 Dev Lane, Localhost City",
      phone:   "+1-000-0000",
    },
  });
  console.log(`✅  School: "${school.name}" (${school.id})`);

  // ── 2. Ensure grades 1–6 exist for the demo school ────────────────────────
  const grades = [];
  for (let level = 1; level <= 6; level++) {
    const grade = await prisma.grade.upsert({
      where:  { level_schoolId: { level, schoolId: DEMO_SCHOOL_ID } },
      update: {},
      create: { level, schoolId: DEMO_SCHOOL_ID },
    });
    grades.push(grade);
  }
  console.log("✅  Grades 1–6");

  // ── 3. Ensure at least one subject and one class exist ────────────────────
  const subject = await prisma.subject.upsert({
    where:  { name_schoolId: { name: "Mathematics", schoolId: DEMO_SCHOOL_ID } },
    update: {},
    create: { name: "Mathematics", schoolId: DEMO_SCHOOL_ID },
  });

  // ── 4. Provider (no schoolId) ─────────────────────────────────────────────
  {
    const acc = DEMO_ACCOUNTS.provider;
    const hash = await bcrypt.hash(acc.password, 12);
    await prisma.user.upsert({
      where:  { email: acc.email },
      update: { passwordHash: hash, username: acc.username },
      create: {
        username:     acc.username,
        email:        acc.email,
        passwordHash: hash,
        role:         acc.role,
        schoolId:     null,
      },
    });
    console.log(`✅  Provider  → ${acc.email}`);
  }

  // ── 5. Admin ──────────────────────────────────────────────────────────────
  {
    const acc = DEMO_ACCOUNTS.admin;
    const hash = await bcrypt.hash(acc.password, 12);
    const user = await prisma.user.upsert({
      where:  { email: acc.email },
      update: { passwordHash: hash, username: acc.username },
      create: {
        username:     acc.username,
        email:        acc.email,
        passwordHash: hash,
        role:         acc.role,
        schoolId:     acc.schoolId,
      },
    });
    // Ensure Admin profile row exists
    await prisma.admin.upsert({
      where:  { id: user.id },
      update: {},
      create: {
        id:       user.id,
        username: acc.username,
        schoolId: DEMO_SCHOOL_ID,
      },
    });
    console.log(`✅  Admin     → ${acc.email}`);
  }

  // ── 6. Teacher ────────────────────────────────────────────────────────────
  let teacherProfileId: string;
  {
    const acc = DEMO_ACCOUNTS.teacher;
    const hash = await bcrypt.hash(acc.password, 12);
    const user = await prisma.user.upsert({
      where:  { email: acc.email },
      update: { passwordHash: hash, username: acc.username },
      create: {
        username:     acc.username,
        email:        acc.email,
        passwordHash: hash,
        role:         acc.role,
        schoolId:     acc.schoolId,
      },
    });
    teacherProfileId = user.id;

    // Ensure Teacher profile row exists
    await prisma.teacher.upsert({
      where:  { id: user.id },
      update: {},
      create: {
        id:        user.id,
        username:  acc.username,
        name:      "Demo",
        surname:   "Teacher",
        email:     acc.email,
        phone:     "000-0002",
        address:   "2 Demo Lane",
        bloodType: "A+",
        sex:       UserSex.MALE,
        birthday:  new Date("1985-01-01"),
        schoolId:  DEMO_SCHOOL_ID,
        subjects:  { connect: [{ id: subject.id }] },
      },
    });
    console.log(`✅  Teacher   → ${acc.email}`);
  }

  // ── 7. Ensure class 1A exists (needed for the demo student) ───────────────
  const demoClass = await prisma.class.upsert({
    where:  { name_schoolId: { name: "1A", schoolId: DEMO_SCHOOL_ID } },
    update: {},
    create: {
      name:        "1A",
      capacity:    30,
      gradeId:     grades[0].id,
      schoolId:    DEMO_SCHOOL_ID,
      supervisorId: teacherProfileId,
    },
  });

  // ── 8. Student needs a parent row first ───────────────────────────────────
  const parentUser = await prisma.user.upsert({
    where:  { email: "parent@example.com" },
    update: {},
    create: {
      username:     "demo_parent",
      email:        "parent@example.com",
      passwordHash: await bcrypt.hash("Parent@123!", 12),
      role:         "student",   // parent is not a first-class role
      schoolId:     DEMO_SCHOOL_ID,
    },
  });
  const parent = await prisma.parent.upsert({
    where:  { id: parentUser.id },
    update: {},
    create: {
      id:       parentUser.id,
      username: "demo_parent",
      name:     "Demo",
      surname:  "Parent",
      email:    "parent@example.com",
      phone:    "000-0003",
      address:  "3 Demo Lane",
      schoolId: DEMO_SCHOOL_ID,
    },
  });

  // ── 9. Student ─────────────────────────────────────────────────────────────
  {
    const acc = DEMO_ACCOUNTS.student;
    const hash = await bcrypt.hash(acc.password, 12);
    const user = await prisma.user.upsert({
      where:  { email: acc.email },
      update: { passwordHash: hash, username: acc.username },
      create: {
        username:     acc.username,
        email:        acc.email,
        passwordHash: hash,
        role:         acc.role,
        schoolId:     acc.schoolId,
      },
    });

    // Ensure Student profile row exists
    await prisma.student.upsert({
      where:  { id: user.id },
      update: {},
      create: {
        id:        user.id,
        username:  acc.username,
        name:      "Demo",
        surname:   "Student",
        email:     acc.email,
        phone:     "000-0004",
        address:   "4 Demo Lane",
        bloodType: "O+",
        sex:       UserSex.FEMALE,
        birthday:  new Date("2010-06-15"),
        gradeId:   grades[0].id,
        classId:   demoClass.id,
        parentId:  parent.id,
        schoolId:  DEMO_SCHOOL_ID,
      },
    });
    console.log(`✅  Student   → ${acc.email}`);
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                  DEMO CREDENTIALS (Dev only)                     ║
╠══════════════╦══════════════════════════╦═══════════════════════╣
║ Role         ║ Email                    ║ Password              ║
╠══════════════╬══════════════════════════╬═══════════════════════╣
║ Super Admin  ║ superadmin@example.com   ║ SuperAdmin@123!       ║
║ Provider     ║ provider@example.com     ║ Provider@123!         ║
║ Admin        ║ admin@example.com        ║ Admin@123!            ║
║ Teacher      ║ teacher@example.com      ║ Teacher@123!          ║
║ Student      ║ student@example.com      ║ Student@123!          ║
╚══════════════╩══════════════════════════╩═══════════════════════╝

  Login at: http://localhost:3000/sign-in
  Use your email OR username to sign in.

  ⚠  These accounts are for local development only.
     Remove before production:
     DELETE FROM "User" WHERE email LIKE '%@example.com';
`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
