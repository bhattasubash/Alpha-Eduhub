/**
 * Prisma seed — creates only the super admin account.
 * Run with: npx prisma db seed
 *
 * ⚠  This seed is for initial setup only.
 *    Change the password immediately after first login.
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
  console.log("🌱  Seeding database…");

  // ── Super Admin account only ───────────────────────────────────────────────
  const superAdminHash = await bcrypt.hash("SuperAdmin@123!", 12);
  const superAdminUser = await prisma.user.upsert({
    where:  { username: "superadmin" },
    update: {},
    create: {
      username:     "superadmin",
      email:        "superadmin@alphaedu.com",
      passwordHash: superAdminHash,
      role:         "SUPER_ADMIN",
      schoolId:     null,
    },
  });
  console.log("✅  Super Admin user:", superAdminUser.username);
  console.log("\n🎉  Seed complete!");
  console.log("\n  Login credentials:");
  console.log("  Super Admin → username: superadmin  password: SuperAdmin@123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
