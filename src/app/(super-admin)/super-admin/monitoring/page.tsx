import { redirect } from "next/navigation";
import { requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import SystemHealthCards from "@/components/super-admin/SystemHealthCards";

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
  const [
    schoolCount, userCount, studentCount, teacherCount,
    auditCount, tokenCount,
  ] = await Promise.all([
    prisma.school.count(),
    prisma.user.count(),
    prisma.student.count(),
    prisma.teacher.count(),
    prisma.auditLog.count(),
    prisma.refreshToken.count(),
  ]);

  // Recent errors from audit (actions that might indicate issues)
  const recentAudit = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { action: true, entity: true, createdAt: true, actorRole: true },
  });

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
