/**
 * Prisma seed — creates demo accounts for Alpha Edu Hub
 * Run with: npx prisma db seed
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

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱  Seeding database with demo accounts…");

  // ── Demo School ─────────────────────────────────────────────────────────────
  let demoSchool = await prisma.school.findFirst({
    where: { name: "Demo School" }
  });

  if (!demoSchool) {
    demoSchool = await prisma.school.create({
      data: {
        name: "Demo School",
        address: "123 Education Street",
        phone: "+1-234-567-8900",
        email: "info@demoschool.edu",
      },
    });
    console.log("✅  Demo school created:", demoSchool.name);
  } else {
    console.log("✅  Demo school already exists:", demoSchool.name);
  }

  // ── Demo Users with proper credentials ───────────────────────────────────────
  const demoUsers = [
    {
      username: 'demo.superadmin@alphaeduhub.com',
      email: 'demo.superadmin@alphaeduhub.com',
      password: 'DemoSuperAdmin@123',
      role: 'SUPER_ADMIN' as const,
      schoolId: null,
    },
    {
      username: 'demo.admin@alphaeduhub.com',
      email: 'demo.admin@alphaeduhub.com',
      password: 'DemoAdmin@123',
      role: 'SCHOOL_ADMIN' as const,
      schoolId: demoSchool.id,
    },
    {
      username: 'demo.teacher@alphaeduhub.com',
      email: 'demo.teacher@alphaeduhub.com',
      password: 'DemoTeacher@123',
      role: 'TEACHER' as const,
      schoolId: demoSchool.id,
    },
    {
      username: 'demo.student@alphaeduhub.com',
      email: 'demo.student@alphaeduhub.com',
      password: 'DemoStudent@123',
      role: 'STUDENT' as const,
      schoolId: demoSchool.id,
    },
  ];

  for (const userData of demoUsers) {
    try {
      const passwordHash = await bcrypt.hash(userData.password, 12);
      
      const user = await prisma.user.upsert({
        where: { username: userData.username },
        update: { passwordHash },
        create: {
          username: userData.username,
          email: userData.email,
          passwordHash,
          role: userData.role,
          schoolId: userData.schoolId,
        },
      });
      
      console.log(`✅  Demo user created/updated: ${user.username} (${user.role})`);
    } catch (error) {
      console.error(`❌  Failed to create user ${userData.username}:`, error);
    }
  }

  console.log("\n🎉  Demo accounts seed complete!");
  console.log("\n  Demo Login Credentials:");
  console.log("  👑 Super Admin → demo.superadmin@alphaeduhub.com / DemoSuperAdmin@123");
  console.log("  🛡️ School Admin → demo.admin@alphaeduhub.com / DemoAdmin@123");
  console.log("  👨‍🏫 Teacher → demo.teacher@alphaeduhub.com / DemoTeacher@123");
  console.log("  👨‍🎓 Student → demo.student@alphaeduhub.com / DemoStudent@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });