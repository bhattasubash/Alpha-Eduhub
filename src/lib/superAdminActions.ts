"use server";

import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/getRole";
import { signAccessToken, signRefreshToken, setAuthCookies, getServerSession } from "@/lib/auth";
import { getCanonicalRole, getSession } from "@/lib/getRole";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

type ActionResult = { success: boolean; error: boolean; message?: string; data?: unknown };

// ─── Guard helper ──────────────────────────────────────────────────────────────

async function guardSuperAdmin() {
  const session = await requireSession(["SUPER_ADMIN"]);
  return session;
}

// ─── SCHOOL CRUD ─────────────────────────────────────────────────────────────

const CreateSchoolSchema = z.object({
  name:        z.string().min(2).max(100),
  address:     z.string().optional(),
  phone:       z.string().optional(),
  email:       z.string().email().optional(),
  website:     z.string().url().optional().or(z.literal("")),
  status:      z.enum(["ACTIVE", "SUSPENDED", "TRIAL", "INACTIVE"]).default("TRIAL"),
  subscriptionPlan: z.enum(["FREE", "STARTER", "PROFESSIONAL", "ENTERPRISE"]).default("FREE"),
  timezone:    z.string().optional(),
  academicYear:z.string().optional(),
  storageLimitMb: z.coerce.number().int().min(128).default(512),
});

export async function createSchool(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session = await guardSuperAdmin();

    const parsed = CreateSchoolSchema.safeParse({
      name:           formData.get("name"),
      address:        formData.get("address") || undefined,
      phone:          formData.get("phone") || undefined,
      email:          formData.get("email") || undefined,
      website:        formData.get("website") || undefined,
      status:         formData.get("status") || "TRIAL",
      subscriptionPlan: formData.get("subscriptionPlan") || "FREE",
      timezone:       formData.get("timezone") || undefined,
      academicYear:   formData.get("academicYear") || undefined,
      storageLimitMb: formData.get("storageLimitMb") || 512,
    });

    if (!parsed.success) {
      return { success: false, error: true, message: parsed.error.errors[0]?.message ?? "Validation error" };
    }

    const school = await prisma.school.create({
      data: {
        name:           parsed.data.name,
        address:        parsed.data.address,
        phone:          parsed.data.phone,
        email:          parsed.data.email,
        website:        parsed.data.website || null,
        status:         parsed.data.status as "ACTIVE" | "SUSPENDED" | "TRIAL" | "INACTIVE",
        subscriptionPlan: parsed.data.subscriptionPlan as "FREE" | "STARTER" | "PROFESSIONAL" | "ENTERPRISE",
        timezone:       parsed.data.timezone,
        academicYear:   parsed.data.academicYear,
        storageLimitMb: parsed.data.storageLimitMb,
        trialEndsAt:    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days trial
      },
    });

    // Create default subscription
    await prisma.subscription.create({
      data: {
        schoolId:   school.id,
        plan:       parsed.data.subscriptionPlan as "FREE" | "STARTER" | "PROFESSIONAL" | "ENTERPRISE",
        status:     "TRIAL",
        trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    await logAudit({
      action: "CREATE_SCHOOL",
      entity: "School",
      entityId: school.id,
      actorId: session.userId,
      actorRole: session.role,
      metadata: { schoolName: school.name },
    });

    revalidatePath("/super-admin/schools");
    revalidatePath("/super-admin");
    return { success: true, error: false, data: { id: school.id } };
  } catch (err) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return { success: false, error: true, message: err.message };
    }
    console.error("[createSchool]", err);
    return { success: false, error: true, message: "Failed to create school." };
  }
}

export async function updateSchool(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session = await guardSuperAdmin();
    const id = formData.get("id") as string;
    if (!id) return { success: false, error: true, message: "School ID required." };

    const name    = formData.get("name") as string;
    const address = formData.get("address") as string | null;
    const phone   = formData.get("phone") as string | null;
    const email   = formData.get("email") as string | null;
    const website = formData.get("website") as string | null;
    const status  = formData.get("status") as "ACTIVE" | "SUSPENDED" | "TRIAL" | "INACTIVE" | null;
    const timezone      = formData.get("timezone") as string | null;
    const academicYear  = formData.get("academicYear") as string | null;
    const storageLimitMb = formData.get("storageLimitMb");

    await prisma.school.update({
      where: { id },
      data: {
        ...(name     ? { name }                         : {}),
        ...(address  ? { address }                      : {}),
        ...(phone    ? { phone }                        : {}),
        ...(email    ? { email }                        : {}),
        ...(website  ? { website }                      : {}),
        ...(status   ? { status }                       : {}),
        ...(timezone ? { timezone }                     : {}),
        ...(academicYear ? { academicYear }             : {}),
        ...(storageLimitMb ? { storageLimitMb: parseInt(storageLimitMb as string) } : {}),
      },
    });

    await logAudit({
      action: "UPDATE_SCHOOL",
      entity: "School",
      entityId: id,
      actorId: session.userId,
      actorRole: session.role,
    });

    revalidatePath("/super-admin/schools");
    revalidatePath(`/super-admin/schools/${id}`);
    return { success: true, error: false };
  } catch (err) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return { success: false, error: true, message: err.message };
    }
    console.error("[updateSchool]", err);
    return { success: false, error: true, message: "Failed to update school." };
  }
}

export async function deleteSchool(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session = await guardSuperAdmin();
    const id = formData.get("id") as string;
    if (!id) return { success: false, error: true, message: "School ID required." };

    const school = await prisma.school.findUnique({ where: { id } });
    if (!school) return { success: false, error: true, message: "School not found." };

    // Delete tables with NoAction constraints and User (no cascade defined)
    // Prisma will handle other Cascade deletions automatically
    await prisma.$transaction(async (tx) => {
      // Delete payments (has NoAction with school)
      await tx.payment.deleteMany({ where: { schoolId: id } });

      // Delete invoices (has NoAction with school)
      await tx.invoice.deleteMany({ where: { schoolId: id } });

      // Delete student fees (has NoAction with school)
      await tx.studentFee.deleteMany({ where: { schoolId: id } });

      // Delete users (no cascade defined with school)
      await tx.user.deleteMany({ where: { schoolId: id } });

      // Delete the school - Prisma will cascade delete all other related records
      await tx.school.delete({ where: { id } });
    });

    await logAudit({
      action: "DELETE_SCHOOL",
      entity: "School",
      entityId: id,
      actorId: session.userId,
      actorRole: session.role,
      metadata: { schoolName: school.name },
    });

    revalidatePath("/super-admin/schools");
    revalidatePath("/super-admin");
    return { success: true, error: false };
  } catch (err) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return { success: false, error: true, message: err.message };
    }
    console.error("[deleteSchool]", err);
    return { success: false, error: true, message: "Failed to delete school. The school may have related records that prevent deletion." };
  }
}

export async function suspendSchool(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session = await guardSuperAdmin();
    const id = formData.get("id") as string;
    if (!id) return { success: false, error: true, message: "School ID required." };

    await prisma.school.update({
      where: { id },
      data: { status: "SUSPENDED" },
    });

    await logAudit({
      action: "SUSPEND_SCHOOL",
      entity: "School",
      entityId: id,
      actorId: session.userId,
      actorRole: session.role,
    });

    revalidatePath("/super-admin/schools");
    return { success: true, error: false };
  } catch (err) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return { success: false, error: true, message: err.message };
    }
    console.error("[suspendSchool]", err);
    return { success: false, error: true, message: "Failed to suspend school." };
  }
}

export async function activateSchool(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session = await guardSuperAdmin();
    const id = formData.get("id") as string;
    if (!id) return { success: false, error: true, message: "School ID required." };

    await prisma.school.update({
      where: { id },
      data: { status: "ACTIVE" },
    });

    await logAudit({
      action: "ACTIVATE_SCHOOL",
      entity: "School",
      entityId: id,
      actorId: session.userId,
      actorRole: session.role,
    });

    revalidatePath("/super-admin/schools");
    return { success: true, error: false };
  } catch (err) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return { success: false, error: true, message: err.message };
    }
    console.error("[activateSchool]", err);
    return { success: false, error: true, message: "Failed to activate school." };
  }
}

// ─── SCHOOL ADMIN CREATION ────────────────────────────────────────────────────

const CreateSchoolAdminSchema = z.object({
  username:  z.string().min(3).max(50),
  email:     z.string().email(),
  password:  z.string().min(8),
  schoolId:  z.string().min(1),
});

export async function createSchoolAdmin(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session = await guardSuperAdmin();

    const parsed = CreateSchoolAdminSchema.safeParse({
      username: formData.get("username"),
      email:    formData.get("email"),
      password: formData.get("password"),
      schoolId: formData.get("schoolId"),
    });

    if (!parsed.success) {
      return { success: false, error: true, message: parsed.error.errors[0]?.message ?? "Validation error" };
    }

    const { username, email, password, schoolId } = parsed.data;

    // Check for existing user
    const existing = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (existing) {
      return { success: false, error: true, message: "Username or email already taken." };
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        role:     "admin",
        schoolId,
      },
    });

    await prisma.admin.create({
      data: {
        id:       user.id,
        username: user.username,
        schoolId,
      },
    });

    await logAudit({
      action: "CREATE_SCHOOL_ADMIN",
      entity: "User",
      entityId: user.id,
      actorId: session.userId,
      actorRole: session.role,
      schoolId,
      metadata: { username, email, schoolId },
    });

    revalidatePath(`/super-admin/schools/${schoolId}`);
    revalidatePath("/super-admin/users");
    return { success: true, error: false, data: { userId: user.id } };
  } catch (err) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return { success: false, error: true, message: err.message };
    }
    console.error("[createSchoolAdmin]", err);
    return { success: false, error: true, message: "Failed to create school admin." };
  }
}

// ─── USER MANAGEMENT ─────────────────────────────────────────────────────────

export async function suspendUser(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session = await guardSuperAdmin();
    const userId = formData.get("userId") as string;
    if (!userId) return { success: false, error: true, message: "User ID required." };

    // We soft-suspend by marking the role with a prefix in metadata/auditLog
    // Since User doesn't have a status field yet, we log the action
    // and optionally delete all refresh tokens to force logout
    await prisma.refreshToken.deleteMany({ where: { userId } });

    await logAudit({
      action: "SUSPEND_USER",
      entity: "User",
      entityId: userId,
      actorId: session.userId,
      actorRole: session.role,
    });

    revalidatePath("/super-admin/users");
    return { success: true, error: false, message: "User sessions terminated." };
  } catch (err) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return { success: false, error: true, message: err.message };
    }
    console.error("[suspendUser]", err);
    return { success: false, error: true, message: "Failed to suspend user." };
  }
}

export async function restoreUserSessions(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session = await guardSuperAdmin();
    const userId = formData.get("userId") as string;
    if (!userId) return { success: false, error: true, message: "User ID required." };

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { success: false, error: true, message: "User not found." };

    // Create a new refresh token to allow user to log back in
    const refreshToken = await signRefreshToken({
      userId: user.id,
      role: user.role,
      schoolId: user.schoolId,
      username: user.username,
    });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt },
    });

    await logAudit({
      action: "RESTORE_USER_SESSIONS",
      entity: "User",
      entityId: userId,
      actorId: session.userId,
      actorRole: session.role,
      metadata: { username: user.username },
    });

    revalidatePath("/super-admin/users");
    return { success: true, error: false, message: "User sessions restored. User can now log in." };
  } catch (err) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return { success: false, error: true, message: err.message };
    }
    console.error("[restoreUserSessions]", err);
    return { success: false, error: true, message: "Failed to restore user sessions." };
  }
}

export async function forceLogoutUser(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session = await guardSuperAdmin();
    const userId = formData.get("userId") as string;
    if (!userId) return { success: false, error: true, message: "User ID required." };

    await prisma.refreshToken.deleteMany({ where: { userId } });

    await logAudit({
      action: "FORCE_LOGOUT",
      entity: "User",
      entityId: userId,
      actorId: session.userId,
      actorRole: session.role,
    });

    revalidatePath("/super-admin/users");
    return { success: true, error: false, message: "User force-logged out." };
  } catch (err) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return { success: false, error: true, message: err.message };
    }
    console.error("[forceLogoutUser]", err);
    return { success: false, error: true, message: "Failed to force logout." };
  }
}

export async function resetUserPassword(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session = await guardSuperAdmin();
    const userId      = formData.get("userId") as string;
    const newPassword = formData.get("newPassword") as string;
    if (!userId || !newPassword) {
      return { success: false, error: true, message: "User ID and new password required." };
    }
    if (newPassword.length < 8) {
      return { success: false, error: true, message: "Password must be at least 8 characters." };
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
    // Invalidate all sessions
    await prisma.refreshToken.deleteMany({ where: { userId } });

    await logAudit({
      action: "RESET_PASSWORD",
      entity: "User",
      entityId: userId,
      actorId: session.userId,
      actorRole: session.role,
    });

    revalidatePath("/super-admin/users");
    return { success: true, error: false, message: "Password reset successfully." };
  } catch (err) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return { success: false, error: true, message: err.message };
    }
    console.error("[resetUserPassword]", err);
    return { success: false, error: true, message: "Failed to reset password." };
  }
}

export async function deleteUser(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session = await guardSuperAdmin();
    const userId = formData.get("userId") as string;
    if (!userId) return { success: false, error: true, message: "User ID required." };

    // Prevent deleting yourself
    if (userId === session.userId) {
      return { success: false, error: true, message: "Cannot delete your own account." };
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { success: false, error: true, message: "User not found." };

    await prisma.user.delete({ where: { id: userId } });

    await logAudit({
      action: "DELETE_USER",
      entity: "User",
      entityId: userId,
      actorId: session.userId,
      actorRole: session.role,
      metadata: { username: user.username, role: user.role },
    });

    revalidatePath("/super-admin/users");
    return { success: true, error: false };
  } catch (err) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return { success: false, error: true, message: err.message };
    }
    console.error("[deleteUser]", err);
    return { success: false, error: true, message: "Failed to delete user." };
  }
}

// ─── SUBSCRIPTION MANAGEMENT ─────────────────────────────────────────────────

export async function updateSubscription(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session = await guardSuperAdmin();
    const schoolId = formData.get("schoolId") as string;
    const plan     = formData.get("plan") as "FREE" | "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
    const status   = formData.get("status") as "ACTIVE" | "EXPIRED" | "CANCELLED" | "TRIAL";
    const expiresAt = formData.get("expiresAt") as string | null;

    if (!schoolId) return { success: false, error: true, message: "School ID required." };

    await prisma.subscription.upsert({
      where: { schoolId },
      create: {
        schoolId,
        plan:      plan ?? "FREE",
        status:    status ?? "TRIAL",
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
      update: {
        ...(plan      ? { plan }                              : {}),
        ...(status    ? { status }                            : {}),
        ...(expiresAt ? { expiresAt: new Date(expiresAt) }   : {}),
      },
    });

    // Also update school's plan field for easy querying
    await prisma.school.update({
      where: { id: schoolId },
      data: {
        subscriptionPlan:   plan ?? undefined,
        subscriptionStatus: status ?? undefined,
        ...(expiresAt ? { subscriptionEndsAt: new Date(expiresAt) } : {}),
      },
    });

    await logAudit({
      action: "UPDATE_SUBSCRIPTION",
      entity: "Subscription",
      actorId: session.userId,
      actorRole: session.role,
      schoolId,
      metadata: { plan, status, expiresAt },
    });

    revalidatePath("/super-admin/subscriptions");
    revalidatePath(`/super-admin/schools/${schoolId}`);
    return { success: true, error: false };
  } catch (err) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return { success: false, error: true, message: err.message };
    }
    console.error("[updateSubscription]", err);
    return { success: false, error: true, message: "Failed to update subscription." };
  }
}

// ─── SUPPORT TICKETS ─────────────────────────────────────────────────────────

export async function updateTicketStatus(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session  = await guardSuperAdmin();
    const ticketId = formData.get("ticketId") as string;
    const status   = formData.get("status") as "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
    const assignedToId = formData.get("assignedToId") as string | null;

    if (!ticketId) return { success: false, error: true, message: "Ticket ID required." };

    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        status,
        ...(assignedToId ? { assignedToId }            : {}),
        ...(status === "RESOLVED" ? { resolvedAt: new Date() } : {}),
      },
    });

    await logAudit({
      action: "UPDATE_TICKET",
      entity: "SupportTicket",
      entityId: ticketId,
      actorId: session.userId,
      actorRole: session.role,
      metadata: { status, assignedToId },
    });

    revalidatePath("/super-admin/support");
    return { success: true, error: false };
  } catch (err) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return { success: false, error: true, message: err.message };
    }
    console.error("[updateTicketStatus]", err);
    return { success: false, error: true, message: "Failed to update ticket." };
  }
}

// ─── PLATFORM ANNOUNCEMENTS ───────────────────────────────────────────────────

const AnnouncementSchema = z.object({
  title:   z.string().min(3).max(200),
  content: z.string().min(10),
  type:    z.enum(["INFO", "WARNING", "MAINTENANCE", "FEATURE"]).default("INFO"),
});

export async function createPlatformAnnouncement(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session = await guardSuperAdmin();

    const parsed = AnnouncementSchema.safeParse({
      title:   formData.get("title"),
      content: formData.get("content"),
      type:    formData.get("type") || "INFO",
    });

    if (!parsed.success) {
      return { success: false, error: true, message: parsed.error.errors[0]?.message ?? "Validation error" };
    }

    const expiresAtStr = formData.get("expiresAt") as string | null;

    await prisma.platformAnnouncement.create({
      data: {
        title:     parsed.data.title,
        content:   parsed.data.content,
        type:      parsed.data.type,
        createdBy: session.userId,
        expiresAt: expiresAtStr ? new Date(expiresAtStr) : null,
      },
    });

    await logAudit({
      action: "CREATE_ANNOUNCEMENT",
      entity: "PlatformAnnouncement",
      actorId: session.userId,
      actorRole: session.role,
      metadata: { title: parsed.data.title, type: parsed.data.type },
    });

    revalidatePath("/super-admin/announcements");
    return { success: true, error: false };
  } catch (err) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return { success: false, error: true, message: err.message };
    }
    console.error("[createPlatformAnnouncement]", err);
    return { success: false, error: true, message: "Failed to create announcement." };
  }
}

// ─── PLATFORM SETTINGS ────────────────────────────────────────────────────────

export async function updatePlatformSetting(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session  = await guardSuperAdmin();
    const key      = formData.get("key") as string;
    const value    = formData.get("value") as string;
    const category = (formData.get("category") as string) || "general";

    if (!key) return { success: false, error: true, message: "Setting key required." };

    await prisma.platformSetting.upsert({
      where:  { key },
      create: { key, value, category },
      update: { value, category },
    });

    await logAudit({
      action: "UPDATE_PLATFORM_SETTING",
      entity: "PlatformSetting",
      actorId: session.userId,
      actorRole: session.role,
      metadata: { key, category },
    });

    revalidatePath("/super-admin/settings");
    return { success: true, error: false };
  } catch (err) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return { success: false, error: true, message: err.message };
    }
    console.error("[updatePlatformSetting]", err);
    return { success: false, error: true, message: "Failed to update setting." };
  }
}

// ─── FEES MANAGEMENT ──────────────────────────────────────────────────────────

const CreateFeeStructureSchema = z.object({
  schoolId:    z.string().min(1),
  name:        z.string().min(3).max(100),
  description: z.string().optional(),
  totalAmount: z.coerce.number().min(0),
});

export async function createFeeStructure(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session = await guardSuperAdmin();

    const parsed = CreateFeeStructureSchema.safeParse({
      schoolId:    formData.get("schoolId"),
      name:        formData.get("name"),
      description: formData.get("description") || undefined,
      totalAmount: formData.get("totalAmount"),
    });

    if (!parsed.success) {
      return { success: false, error: true, message: parsed.error.errors[0]?.message ?? "Validation error" };
    }

    // @ts-ignore
    const feeStructure = await prisma.feeStructure.create({
      data: {
        schoolId:    parsed.data.schoolId,
        name:        parsed.data.name,
        description: parsed.data.description,
        totalAmount: parsed.data.totalAmount,
      },
    });

    await logAudit({
      action: "CREATE_FEE_STRUCTURE",
      entity: "FeeStructure",
      entityId: feeStructure.id,
      actorId: session.userId,
      actorRole: session.role,
      schoolId: feeStructure.schoolId,
      metadata: { name: feeStructure.name, amount: feeStructure.totalAmount },
    });

    revalidatePath(`/super-admin/schools/${parsed.data.schoolId}/fees`);
    return { success: true, error: false, data: feeStructure };
  } catch (err) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return { success: false, error: true, message: err.message };
    }
    console.error("[createFeeStructure]", err);
    return { success: false, error: true, message: "Failed to create fee structure." };
  }
}

const RecordPaymentSchema = z.object({
  invoiceId:     z.string().min(1),
  amount:        z.coerce.number().positive(),
  paymentMethod: z.string().min(2),
  notes:         z.string().optional(),
});

export async function recordPaymentForInvoice(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {

  // Note: This action might be better suited for a school admin.
  // For now, we'll keep it as a super admin action for demonstration.
  try {
    const session = await guardSuperAdmin();

    const parsed = RecordPaymentSchema.safeParse({
      invoiceId:     formData.get("invoiceId"),
      amount:        formData.get("amount"),
      paymentMethod: formData.get("paymentMethod"),
      notes:         formData.get("notes") || undefined,
    });

    if (!parsed.success) {
      return { success: false, error: true, message: parsed.error.errors[0]?.message ?? "Validation error" };
    }

    // This would be a more complex transaction in a real app:
    // 1. Find the invoice and related studentFee.
    // 2. Create the payment record.
    // 3. Update studentFee's amountPaid and balance.
    // 4. Update invoice status (e.g., to PAID or PARTIALLY_PAID).
    // 5. Update studentFee status.
    // For now, we'll just log it. This is where you'd add the Prisma transaction.

    await logAudit({
      action: "RECORD_PAYMENT",
      entity: "Payment",
      actorId: session.userId,
      actorRole: session.role,
      metadata: { ...parsed.data },
    });

    revalidatePath(`/super-admin/invoices`);
    return { success: true, error: false, message: "Payment recording has been logged." };
  } catch (err) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return { success: false, error: true, message: err.message };
    }
    console.error("[recordPaymentForInvoice]", err);
    return { success: false, error: true, message: "Failed to record payment." };
  }
}

// ─── SCHOOL CONTEXT SWITCHER ──────────────────────────────────────────

export async function switchSchoolContext(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session = await guardSuperAdmin();
    const schoolId = formData.get("schoolId") as string;

    if (schoolId) {
      cookies().set("super_admin_school_context", schoolId, {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 24 hours
      });

      await logAudit({
        action: "SWITCH_SCHOOL_CONTEXT",
        entity: "School",
        entityId: schoolId,
        actorId: session.userId,
        actorRole: session.role,
        schoolId,
        metadata: { targetSchoolId: schoolId },
      });
    } else {
      cookies().delete("super_admin_school_context");
    }

    revalidatePath("/super-admin");
    return { success: true, error: false, message: "School context updated." };
  } catch (err) {
    console.error("[switchSchoolContext]", err);
    return { success: false, error: true, message: "Failed to switch school context." };
  }
}

// ─── ADMIN IMPERSONATION ──────────────────────────────────────────────

export async function impersonateSchoolAdmin(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session = await guardSuperAdmin();
    const targetSchoolId = formData.get("schoolId") as string;

    if (!targetSchoolId) {
      return { success: false, error: true, message: "Target school ID required for impersonation." };
    }

    // Find school details and an admin account for that school
    const school = await prisma.school.findUnique({
      where: { id: targetSchoolId },
      include: { admins: true },
    });

    if (!school) {
      return { success: false, error: true, message: "School not found." };
    }

    const targetAdmin = school.admins[0];

    // Log impersonation event with explicit audit details
    await logAudit({
      action: "IMPERSONATE_ADMIN",
      entity: "School",
      entityId: targetSchoolId,
      actorId: session.userId,
      actorRole: session.role,
      schoolId: targetSchoolId,
      metadata: {
        impersonatedAdminId: targetAdmin?.id ?? "GENERAL_ADMIN_CONTEXT",
        impersonatedSchoolName: school.name,
        startedAt: new Date().toISOString(),
      },
    });

    // Set impersonation cookie flags
    cookies().set("super_admin_impersonation", "true", { path: "/", httpOnly: true });
    cookies().set("super_admin_school_context", targetSchoolId, { path: "/", httpOnly: true });

    revalidatePath("/admin");
    return {
      success: true,
      error: false,
      message: `Now impersonating Admin for ${school.name}.`,
      data: { redirectUrl: "/admin" },
    };
  } catch (err) {
    console.error("[impersonateSchoolAdmin]", err);
    return { success: false, error: true, message: "Failed to initiate impersonation." };
  }
}

export async function clearImpersonation(): Promise<ActionResult> {
  try {
    const session = await guardSuperAdmin();
    cookies().delete("super_admin_impersonation");
    cookies().delete("super_admin_school_context");

    await logAudit({
      action: "EXIT_IMPERSONATION",
      entity: "School",
      actorId: session.userId,
      actorRole: session.role,
      metadata: { endedAt: new Date().toISOString() },
    });

    revalidatePath("/super-admin");
    return { success: true, error: false, message: "Exited impersonation mode." };
  } catch (err) {
    console.error("[clearImpersonation]", err);
    return { success: false, error: true, message: "Failed to exit impersonation." };
  }
}

// ─── AUDITED FEE TRANSACTION EDITING ──────────────────────────────────

export async function editFeeTransactionWithAudit(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session = await guardSuperAdmin();
    const paymentId = formData.get("paymentId") as string;
    const newAmountStr = formData.get("amount") as string;
    const notes = formData.get("notes") as string | null;

    if (!paymentId || !newAmountStr) {
      return { success: false, error: true, message: "Payment ID and new amount are required." };
    }

    const existingPayment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!existingPayment) {
      return { success: false, error: true, message: "Payment transaction record not found." };
    }

    const previousValue = {
      amount: existingPayment.amount.toString(),
      paymentMethod: existingPayment.paymentMethod,
      notes: existingPayment.notes,
      paidAt: existingPayment.paidAt,
    };

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        amount: parseFloat(newAmountStr),
        ...(notes ? { notes } : {}),
      },
    });

    const newValue = {
      amount: updatedPayment.amount.toString(),
      paymentMethod: updatedPayment.paymentMethod,
      notes: updatedPayment.notes,
      paidAt: updatedPayment.paidAt,
    };

    await logAudit({
      action: "EDIT_FEE_TRANSACTION",
      entity: "Payment",
      entityId: paymentId,
      actorId: session.userId,
      actorRole: session.role,
      schoolId: existingPayment.schoolId,
      previousValue,
      newValue,
      metadata: { reason: notes || "Super Admin correction" },
    });

    revalidatePath(`/super-admin/schools/${existingPayment.schoolId}/fees`);
    revalidatePath(`/admin/fees`);
    return { success: true, error: false, message: "Fee transaction corrected and audited." };
  } catch (err) {
    console.error("[editFeeTransactionWithAudit]", err);
    return { success: false, error: true, message: "Failed to edit fee transaction." };
  }
}

export async function processFeeRefund(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session = await guardSuperAdmin();
    const paymentId = formData.get("paymentId") as string;
    const refundReason = (formData.get("reason") as string) || "Customer refund processed";

    if (!paymentId) {
      return { success: false, error: true, message: "Payment ID is required for refund." };
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { invoice: true, studentFee: true },
    });

    if (!payment) {
      return { success: false, error: true, message: "Transaction record not found." };
    }

    const previousValue = {
      paymentAmount: payment.amount.toString(),
      invoiceStatus: payment.invoice.status,
      studentFeePaid: payment.studentFee.amountPaid.toString(),
      studentFeeBalance: payment.studentFee.balance.toString(),
    };

    // Update invoice status to REFUNDED and recalculate student balance
    const updatedInvoice = await prisma.invoice.update({
      where: { id: payment.invoiceId },
      data: { status: "REFUNDED" },
    });

    const newAmountPaid = Math.max(0, Number(payment.studentFee.amountPaid) - Number(payment.amount));
    const newBalance = Number(payment.studentFee.totalAmount) - newAmountPaid;

    const updatedStudentFee = await prisma.studentFee.update({
      where: { id: payment.studentFeeId },
      data: {
        amountPaid: newAmountPaid,
        balance: newBalance,
        status: newBalance <= 0 ? "PAID" : newAmountPaid > 0 ? "PARTIALLY_PAID" : "UNPAID",
      },
    });

    const newValue = {
      refundedAmount: payment.amount.toString(),
      invoiceStatus: updatedInvoice.status,
      studentFeePaid: updatedStudentFee.amountPaid.toString(),
      studentFeeBalance: updatedStudentFee.balance.toString(),
    };

    await logAudit({
      action: "PROCESS_REFUND",
      entity: "Payment",
      entityId: paymentId,
      actorId: session.userId,
      actorRole: session.role,
      schoolId: payment.schoolId,
      previousValue,
      newValue,
      metadata: { reason: refundReason },
    });

    revalidatePath(`/super-admin/schools/${payment.schoolId}/fees`);
    return { success: true, error: false, message: "Refund processed successfully with audit record." };
  } catch (err) {
    console.error("[processFeeRefund]", err);
    return { success: false, error: true, message: "Failed to process refund." };
  }
}

export async function applyDiscountOrFine(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session = await guardSuperAdmin();
    const studentFeeId = formData.get("studentFeeId") as string;
    const type = formData.get("type") as "DISCOUNT" | "FINE";
    const adjustmentAmountStr = formData.get("amount") as string;
    const reason = (formData.get("reason") as string) || "Adjustment applied";

    if (!studentFeeId || !type || !adjustmentAmountStr) {
      return { success: false, error: true, message: "Student Fee ID, adjustment type, and amount are required." };
    }

    const fee = await prisma.studentFee.findUnique({
      where: { id: studentFeeId },
    });

    if (!fee) {
      return { success: false, error: true, message: "Student fee record not found." };
    }

    const adjAmount = parseFloat(adjustmentAmountStr);
    const previousTotal = Number(fee.totalAmount);
    const newTotal = type === "DISCOUNT" ? Math.max(0, previousTotal - adjAmount) : previousTotal + adjAmount;
    const newBalance = newTotal - Number(fee.amountPaid);

    const updatedFee = await prisma.studentFee.update({
      where: { id: studentFeeId },
      data: {
        totalAmount: newTotal,
        balance: Math.max(0, newBalance),
        status: newBalance <= 0 ? "PAID" : Number(fee.amountPaid) > 0 ? "PARTIALLY_PAID" : "UNPAID",
      },
    });

    await logAudit({
      action: `APPLY_${type}`,
      entity: "StudentFee",
      entityId: studentFeeId,
      actorId: session.userId,
      actorRole: session.role,
      schoolId: fee.schoolId,
      previousValue: { totalAmount: previousTotal, balance: Number(fee.balance) },
      newValue: { totalAmount: newTotal, balance: updatedFee.balance.toString() },
      metadata: { adjustmentType: type, adjustmentAmount: adjAmount, reason },
    });

    revalidatePath(`/super-admin/schools/${fee.schoolId}/fees`);
    return { success: true, error: false, message: `${type === "DISCOUNT" ? "Discount" : "Fine"} applied successfully.` };
  } catch (err) {
    console.error("[applyDiscountOrFine]", err);
    return { success: false, error: true, message: "Failed to apply adjustment." };
  }
}

// ─── IMPERSONATION ─────────────────────────────────────────────────────────────

export async function impersonateUser(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session = await guardSuperAdmin();
    const targetUserId = formData.get("userId") as string;
    
    if (!targetUserId) return { success: false, error: true, message: "Target user ID required." };

    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) return { success: false, error: true, message: "Target user not found." };

    if (targetUser.role === "SUPER_ADMIN" || targetUser.role === "provider") {
      return { success: false, error: true, message: "Cannot impersonate another Super Admin." };
    }

    // Set new tokens for impersonation
    const payload = {
      userId:   targetUser.id,
      role:     targetUser.role,
      schoolId: targetUser.schoolId,
      username: targetUser.username,
      impersonatorId: session.userId,
    };

    const accessToken  = await signAccessToken(payload);
    const refreshToken = await signRefreshToken(payload);

    // Save refresh token in DB
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: targetUser.id, expiresAt },
    });

    const cookieStore = cookies();
    cookieStore.set("access_token", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 15 });
    cookieStore.set("refresh_token", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });

    await logAudit({
      action: "IMPERSONATE_USER",
      entity: "User",
      entityId: targetUser.id,
      actorId: session.userId,
      actorRole: session.role,
      metadata: { targetUsername: targetUser.username, targetRole: targetUser.role }
    });

    // Determine redirect URL based on target user's role
    let redirectUrl = "/";
    const role = targetUser.role.toLowerCase();
    if (role === "admin" || role === "school_admin") {
      redirectUrl = "/admin";
    } else if (role === "teacher") {
      redirectUrl = "/teacher";
    } else if (role === "student") {
      redirectUrl = "/student";
    } else if (role === "parent") {
      redirectUrl = "/parent";
    }

    return { success: true, error: false, message: "Impersonation started.", data: { redirectUrl } };
  } catch (err) {
    console.error("[impersonateUser]", err);
    return { success: false, error: true, message: "Failed to impersonate user." };
  }
}

export async function exitImpersonation(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session = await getServerSession();
    if (!session || !session.impersonatorId) {
      return { success: false, error: true, message: "Not in impersonation mode." };
    }

    const superAdmin = await prisma.user.findUnique({ where: { id: session.impersonatorId } });
    if (!superAdmin) return { success: false, error: true, message: "Super Admin not found." };

    const payload = {
      userId:   superAdmin.id,
      role:     superAdmin.role,
      schoolId: superAdmin.schoolId,
      username: superAdmin.username,
    };

    const accessToken  = await signAccessToken(payload);
    const refreshToken = await signRefreshToken(payload);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: superAdmin.id, expiresAt },
    });

    const cookieStore = cookies();
    cookieStore.set("access_token", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 15 });
    cookieStore.set("refresh_token", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });

    await logAudit({
      action: "EXIT_IMPERSONATION",
      entity: "User",
      entityId: session.userId,
      actorId: superAdmin.id,
      actorRole: superAdmin.role,
    });

    return { success: true, error: false, message: "Exited impersonation." };
  } catch (err) {
    console.error("[exitImpersonation]", err);
    return { success: false, error: true, message: "Failed to exit impersonation." };
  }
}
