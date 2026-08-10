import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";

export async function logAudit(params: {
  action: string;
  entity: string;
  entityId?: string;
  actorId: string;
  actorRole: string;
  actorEmail?: string;
  schoolId?: string;
  previousValue?: unknown;
  newValue?: unknown;
  metadata?: Record<string, unknown>;
}) {
  try {
    const h = headers();
    const ipAddress =
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      h.get("x-real-ip") ||
      "127.0.0.1";
    const userAgent = h.get("user-agent") || "Unknown Device";

    const session = await getServerSession();
    
    const fullMetadata = {
      ...(params.metadata || {}),
      ...(params.previousValue !== undefined ? { previousValue: params.previousValue } : {}),
      ...(params.newValue !== undefined ? { newValue: params.newValue } : {}),
      ...(session?.impersonatorId ? { impersonatorId: session.impersonatorId } : {}),
    };

    await prisma.auditLog.create({
      data: {
        action:     params.action,
        entity:     params.entity,
        entityId:   params.entityId,
        actorId:    params.actorId,
        actorRole:  params.actorRole,
        actorEmail: params.actorEmail,
        schoolId:   params.schoolId,
        ipAddress:  ipAddress,
        userAgent:  userAgent,
        ...(Object.keys(fullMetadata).length > 0 ? { metadata: fullMetadata as any } : {}),
      },
    });
  } catch (error) {
    console.error("Failed to log audit event:", error);
  }
}
