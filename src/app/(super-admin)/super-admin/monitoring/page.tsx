import { redirect } from "next/navigation";
import { requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import SystemHealthCards from "@/components/super-admin/SystemHealthCards";

export const dynamic = 'force-dynamic';

export default async function MonitoringPage() {
  try {
    await requireSession(["SUPER_ADMIN"]);
  } catch {
    redirect("/sign-in");
  }

  // DB health check
  let dbOk = false;
  let dbLatencyMs = 0;
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - start;
    dbOk = true;
  } catch {
    dbOk = false;
  }

  // Table sizes
  let schoolCount = 0, userCount = 0, studentCount = 0, teacherCount = 0, auditCount = 0, tokenCount = 0;
  let recentAudit: any[] = [];

  try {
    const counts = await Promise.all([
      prisma.school.count(),
      prisma.user.count(),
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.auditLog.count(),
      prisma.refreshToken.count(),
    ]);
    [schoolCount, userCount, studentCount, teacherCount, auditCount, tokenCount] = counts;

    recentAudit = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { action: true, entity: true, createdAt: true, actorRole: true },
    });
  } catch (error) {
    console.error("Database connection failed in SuperAdminMonitoringPage:", error);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">System Monitoring</h1>
        <p className="text-white/40 text-sm mt-0.5">Real-time platform health and performance</p>
      </div>

      <SystemHealthCards
        dbOk={dbOk}
        dbLatencyMs={dbLatencyMs}
        schoolCount={schoolCount}
        userCount={userCount}
        studentCount={studentCount}
        teacherCount={teacherCount}
        auditCount={auditCount}
        activeTokens={tokenCount}
        recentAudit={recentAudit}
      />
    </div>
  );
}
