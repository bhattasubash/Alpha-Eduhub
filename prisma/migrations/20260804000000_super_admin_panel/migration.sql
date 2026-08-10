-- Migration: 20260804000000_super_admin_panel
-- Add SUPER_ADMIN role, SchoolStatus, subscription models, audit logs, support tickets

-- ─── New enums ────────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE "SchoolStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'TRIAL', 'INACTIVE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED', 'TRIAL');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "TicketPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Add new values to UserRole enum
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'SUPER_ADMIN';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'SCHOOL_ADMIN';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'TEACHER' ;
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'STUDENT';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'PARENT';

-- ─── Extend School table ────────────────────────────────────────────────────

ALTER TABLE "School"
  ADD COLUMN IF NOT EXISTS "email"               TEXT,
  ADD COLUMN IF NOT EXISTS "website"             TEXT,
  ADD COLUMN IF NOT EXISTS "logo"                TEXT,
  ADD COLUMN IF NOT EXISTS "status"              "SchoolStatus" NOT NULL DEFAULT 'ACTIVE',
  ADD COLUMN IF NOT EXISTS "updatedAt"           TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "subscriptionPlan"    "SubscriptionPlan" NOT NULL DEFAULT 'FREE',
  ADD COLUMN IF NOT EXISTS "subscriptionStatus"  "SubscriptionStatus" NOT NULL DEFAULT 'TRIAL',
  ADD COLUMN IF NOT EXISTS "trialEndsAt"         TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "subscriptionEndsAt"  TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "storageUsedMb"       INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "storageLimitMb"      INTEGER NOT NULL DEFAULT 512,
  ADD COLUMN IF NOT EXISTS "customDomain"        TEXT,
  ADD COLUMN IF NOT EXISTS "primaryColor"        TEXT,
  ADD COLUMN IF NOT EXISTS "timezone"            TEXT,
  ADD COLUMN IF NOT EXISTS "academicYear"        TEXT;

-- ─── AuditLog ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "AuditLog" (
  "id"         TEXT NOT NULL,
  "action"     TEXT NOT NULL,
  "entity"     TEXT NOT NULL,
  "entityId"   TEXT,
  "actorId"    TEXT NOT NULL,
  "actorRole"  TEXT NOT NULL,
  "actorEmail" TEXT,
  "metadata"   JSONB,
  "ipAddress"  TEXT,
  "userAgent"  TEXT,
  "schoolId"   TEXT,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "AuditLog"
  ADD CONSTRAINT "AuditLog_schoolId_fkey"
  FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ─── Subscription ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "Subscription" (
  "id"            TEXT NOT NULL,
  "schoolId"      TEXT NOT NULL,
  "plan"          "SubscriptionPlan" NOT NULL DEFAULT 'FREE',
  "status"        "SubscriptionStatus" NOT NULL DEFAULT 'TRIAL',
  "pricePerMonth" DECIMAL(65,30),
  "currency"      TEXT NOT NULL DEFAULT 'INR',
  "startedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt"     TIMESTAMP(3),
  "trialEndsAt"   TIMESTAMP(3),
  "cancelledAt"   TIMESTAMP(3),
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Subscription_schoolId_key" ON "Subscription"("schoolId");

ALTER TABLE "Subscription"
  ADD CONSTRAINT "Subscription_schoolId_fkey"
  FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─── Invoice ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "Invoice" (
  "id"             TEXT NOT NULL,
  "subscriptionId" TEXT NOT NULL,
  "amount"         DECIMAL(65,30) NOT NULL,
  "currency"       TEXT NOT NULL DEFAULT 'INR',
  "status"         TEXT NOT NULL DEFAULT 'PENDING',
  "dueDate"        TIMESTAMP(3) NOT NULL,
  "paidAt"         TIMESTAMP(3),
  "invoiceNumber"  TEXT NOT NULL,
  "notes"          TEXT,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");

ALTER TABLE "Invoice"
  ADD CONSTRAINT "Invoice_subscriptionId_fkey"
  FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─── SupportTicket ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "SupportTicket" (
  "id"               TEXT NOT NULL,
  "title"            TEXT NOT NULL,
  "description"      TEXT NOT NULL,
  "status"           "TicketStatus" NOT NULL DEFAULT 'OPEN',
  "priority"         "TicketPriority" NOT NULL DEFAULT 'MEDIUM',
  "submittedById"    TEXT NOT NULL,
  "submittedByEmail" TEXT,
  "assignedToId"     TEXT,
  "resolvedAt"       TIMESTAMP(3),
  "schoolId"         TEXT,
  "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "SupportTicket"
  ADD CONSTRAINT "SupportTicket_schoolId_fkey"
  FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ─── TicketMessage ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "TicketMessage" (
  "id"         TEXT NOT NULL,
  "ticketId"   TEXT NOT NULL,
  "authorId"   TEXT NOT NULL,
  "authorRole" TEXT NOT NULL,
  "content"    TEXT NOT NULL,
  "isInternal" BOOLEAN NOT NULL DEFAULT false,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TicketMessage_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "TicketMessage"
  ADD CONSTRAINT "TicketMessage_ticketId_fkey"
  FOREIGN KEY ("ticketId") REFERENCES "SupportTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─── PlatformSetting ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "PlatformSetting" (
  "id"        TEXT NOT NULL,
  "key"       TEXT NOT NULL,
  "value"     TEXT NOT NULL,
  "category"  TEXT NOT NULL DEFAULT 'general',
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PlatformSetting_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "PlatformSetting_key_key" ON "PlatformSetting"("key");

-- ─── PlatformAnnouncement ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "PlatformAnnouncement" (
  "id"        TEXT NOT NULL,
  "title"     TEXT NOT NULL,
  "content"   TEXT NOT NULL,
  "type"      TEXT NOT NULL DEFAULT 'INFO',
  "targetAll" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PlatformAnnouncement_pkey" PRIMARY KEY ("id")
);

-- ─── Update migration_lock ────────────────────────────────────────────────────
