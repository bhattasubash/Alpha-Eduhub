import { redirect } from "next/navigation";
import { BarChart3, TrendingUp, Users, Building2, GraduationCap, BookOpen } from "lucide-react";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/getRole";
import AnalyticsCharts from "@/components/super-admin/AnalyticsCharts";

export default async function AnalyticsPage() {
  try {
    await requireSession(["SUPER_ADMIN"]);
  } catch {
    redirect("/sign-in");
  }

  // Fetch all time-series analytics data
  const [
    schoolsByMonth,
    studentsByMonth,
    teachersByMonth,
    schoolsByPlan,
    schoolsByStatus,
    topSchoolsByStudents,
  ] = await Promise.all([
    prisma.$queryRaw`
      SELECT
        TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon YYYY') AS month,
        COUNT(*)::int AS count
      FROM "School"
      WHERE "createdAt" >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY DATE_TRUNC('month', "createdAt")
    ` as Promise<{ month: string; count: number }[]>,

    prisma.$queryRaw`
      SELECT
        TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon YYYY') AS month,
        COUNT(*)::int AS count
      FROM "Student"
      WHERE "createdAt" >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY DATE_TRUNC('month', "createdAt")
    ` as Promise<{ month: string; count: number }[]>,

    prisma.$queryRaw`
      SELECT
        TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon YYYY') AS month,
        COUNT(*)::int AS count
      FROM "Teacher"
      WHERE "createdAt" >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY DATE_TRUNC('month', "createdAt")
    ` as Promise<{ month: string; count: number }[]>,

    prisma.school.groupBy({
      by: ["subscriptionPlan"],
      _count: { id: true },
    }),

    prisma.school.groupBy({
      by: ["status"],
      _count: { id: true },
    }),

    prisma.school.findMany({
      orderBy: { students: { _count: "desc" } },
      take: 10,
      select: {
        id: true, name: true,
        _count: { select: { students: true, teachers: true } },
      },
    }),
  ]);

  const planData = schoolsByPlan.map((p) => ({
    name:  p.subscriptionPlan,
    value: p._count.id,
    color: p.subscriptionPlan === "FREE" ? "#6b7280"
         : p.subscriptionPlan === "STARTER" ? "#3b82f6"
         : p.subscriptionPlan === "PROFESSIONAL" ? "#8b5cf6"
         : "#f59e0b",
  }));

  const statusData = schoolsByStatus.map((s) => ({
    name:  s.status,
    value: s._count.id,
    color: s.status === "ACTIVE" ? "#10b981"
         : s.status === "TRIAL" ? "#f59e0b"
         : s.status === "SUSPENDED" ? "#ef4444"
         : "#6b7280",
  }));

  // Summary KPIs
  const [totalSchools, totalStudents, totalTeachers, totalUsers] = await Promise.all([
    prisma.school.count(),
    prisma.student.count(),
    prisma.teacher.count(),
    prisma.user.count(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Analytics</h1>
        <p className="text-white/40 text-sm mt-0.5">Growth and usage metrics across all schools</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Schools",  value: totalSchools,  icon: Building2,    color: "from-purple-600 to-indigo-600" },
          { label: "Total Students", value: totalStudents, icon: GraduationCap,color: "from-blue-600 to-cyan-500"    },
          { label: "Total Teachers", value: totalTeachers, icon: BookOpen,     color: "from-emerald-600 to-teal-500" },
          { label: "Total Users",    value: totalUsers,    icon: Users,        color: "from-orange-600 to-amber-500" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
            <p className="text-white/50 text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <AnalyticsCharts
        schoolsByMonth={schoolsByMonth}
        studentsByMonth={studentsByMonth}
        teachersByMonth={teachersByMonth}
        planData={planData}
        statusData={statusData}
        topSchools={topSchoolsByStudents}
      />
    </div>
  );
}
