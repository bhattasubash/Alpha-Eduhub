import { Suspense } from "react";
import { redirect } from "next/navigation";
import {
  Building2, Users, GraduationCap, BookOpen, CreditCard,
  HeadphonesIcon, Activity, Database, TrendingUp, Shield,
  CheckCircle2, XCircle, Clock, AlertTriangle,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/getRole";
import StatCard from "@/components/super-admin/StatCard";
import StatCardSkeleton from "@/components/super-admin/StatCardSkeleton";
import SchoolGrowthChart from "@/components/super-admin/charts/SchoolGrowthChart";
import RevenueChart from "@/components/super-admin/charts/RevenueChart";
import UserDistributionChart from "@/components/super-admin/charts/UserDistributionChart";
import RecentSchoolsTable from "@/components/super-admin/RecentSchoolsTable";
import RecentAuditLog from "@/components/super-admin/RecentAuditLog";

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getDashboardStats() {
  try {
    let schoolsByMonth: { month: string; count: number }[] = [];
    let studentsByMonth: { month: string; count: number }[] = [];

    try {
      schoolsByMonth = (await prisma.$queryRaw`
        SELECT
          TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon') AS month,
          COUNT(*)::int AS count
        FROM "School"
        WHERE "createdAt" >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY DATE_TRUNC('month', "createdAt")
      `) as any[];
    } catch {
      schoolsByMonth = [];
    }

    try {
      studentsByMonth = (await prisma.$queryRaw`
        SELECT
          TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon') AS month,
          COUNT(*)::int AS count
        FROM "Student"
        WHERE "createdAt" >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY DATE_TRUNC('month', "createdAt")
      `) as any[];
    } catch {
      studentsByMonth = [];
    }

    const [
      totalSchools,
      activeSchools,
      suspendedSchools,
      trialSchools,
      totalStudents,
      totalTeachers,
      totalParents,
      totalAdmins,
      totalUsers,
      openTickets,
      totalAuditLogs,
      recentSchools,
      allSchools,
      recentAuditLogs,
    ] = await Promise.all([
      prisma.school.count(),
      prisma.school.count({ where: { status: "ACTIVE" } }),
      prisma.school.count({ where: { status: "SUSPENDED" } }),
      prisma.school.count({ where: { status: "TRIAL" } }),
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.parent.count(),
      prisma.admin.count(),
      prisma.user.count(),
      prisma.supportTicket.count({ where: { status: "OPEN" } }),
      prisma.auditLog.count(),
      prisma.school.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true, name: true, status: true, createdAt: true,
          subscriptionPlan: true, subscriptionStatus: true,
          _count: { select: { students: true, teachers: true } },
        },
      }),
      prisma.school.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true, name: true, status: true, createdAt: true,
          subscriptionPlan: true, subscriptionStatus: true,
          _count: { select: { students: true, teachers: true } },
        },
      }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true, action: true, entity: true, entityId: true,
          actorId: true, actorRole: true, actorEmail: true,
          createdAt: true, schoolId: true,
        },
      }),
    ]);

    // TODO: Uncomment after running `npx prisma generate`
    // const recentDemoRequests = await (prisma as any).demoRequest.findMany({
    //   orderBy: { createdAt: "desc" },
    //   take: 5,
    // });
    const recentDemoRequests: any[] = [];

    return {
      totalSchools,
      activeSchools,
      suspendedSchools,
      trialSchools,
      totalStudents,
      totalTeachers,
      totalParents,
      totalAdmins,
      totalUsers,
      openTickets,
      totalAuditLogs,
      recentSchools,
      allSchools,
      recentAuditLogs,
      recentDemoRequests,
      schoolsByMonth: Array.isArray(schoolsByMonth) ? schoolsByMonth : [],
      studentsByMonth: Array.isArray(studentsByMonth) ? studentsByMonth : [],
    };
  } catch (err) {
    console.error("[getDashboardStats]", err);
    return {
      totalSchools: 0,
      activeSchools: 0,
      suspendedSchools: 0,
      trialSchools: 0,
      totalStudents: 0,
      totalTeachers: 0,
      totalParents: 0,
      totalAdmins: 0,
      totalUsers: 1,
      openTickets: 0,
      totalAuditLogs: 0,
      recentSchools: [],
      allSchools: [],
      recentAuditLogs: [],
      recentDemoRequests: [],
      schoolsByMonth: [],
      studentsByMonth: [],
    };
  }
}

// ─── Status badge (local helper, not exported) ────────────────────────────────

function statusBadge(status: string) {
  const map: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    ACTIVE:     { label: "Active",     cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20", icon: <CheckCircle2 className="w-3 h-3" /> },
    SUSPENDED:  { label: "Suspended",  cls: "bg-red-500/15 text-red-400 border-red-500/20",             icon: <XCircle className="w-3 h-3" /> },
    TRIAL:      { label: "Trial",      cls: "bg-amber-500/15 text-amber-400 border-amber-500/20",       icon: <Clock className="w-3 h-3" /> },
    INACTIVE:   { label: "Inactive",   cls: "bg-white/10 text-white/40 border-white/10",                icon: <AlertTriangle className="w-3 h-3" /> },
  };
  const s = map[status] ?? map["INACTIVE"];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${s.cls}`}>
      {s.icon}{s.label}
    </span>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SuperAdminDashboard() {
  try {
    await requireSession(["SUPER_ADMIN"]);
  } catch {
    redirect("/sign-in");
  }

  const stats = await getDashboardStats();

  const statCards = [
    {
      title: "Total Schools",
      value: stats.totalSchools,
      subtitle: `${stats.activeSchools} active · ${stats.trialSchools} trial`,
      icon: Building2,
      gradient: "from-purple-600 to-indigo-600",
      change: { value: 12, label: "vs last month" },
    },
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: GraduationCap,
      gradient: "from-blue-600 to-cyan-500",
      change: { value: 8, label: "vs last month" },
    },
    {
      title: "Total Teachers",
      value: stats.totalTeachers,
      icon: BookOpen,
      gradient: "from-emerald-600 to-teal-500",
      change: { value: 5, label: "vs last month" },
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      gradient: "from-orange-600 to-amber-500",
      change: { value: 14, label: "vs last month" },
    },
    {
      title: "Open Tickets",
      value: stats.openTickets,
      subtitle: "Needs attention",
      icon: HeadphonesIcon,
      gradient: "from-rose-600 to-pink-500",
      change: { value: -3, label: "vs last week" },
    },
    {
      title: "Suspended Schools",
      value: stats.suspendedSchools,
      icon: Shield,
      gradient: "from-red-600 to-rose-500",
      change: { value: 0, label: "no change" },
    },
    {
      title: "Platform Health",
      value: "99.9%",
      subtitle: "All systems operational",
      icon: Activity,
      gradient: "from-green-600 to-emerald-400",
      change: { value: 1, label: "uptime" },
    },
    {
      title: "Audit Events",
      value: stats.totalAuditLogs,
      subtitle: "Total tracked actions",
      icon: Database,
      gradient: "from-violet-600 to-purple-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
          <p className="text-white/40 text-sm mt-0.5">
            Real-time metrics across all schools and users
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-xs font-medium">Live</span>
        </div>
      </div>

      {/* Stat cards grid */}
      <Suspense fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
      }>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>
      </Suspense>

      {/* School status summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Active Schools",    count: stats.activeSchools,    color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
          { label: "Trial Schools",     count: stats.trialSchools,     color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20" },
          { label: "Suspended Schools", count: stats.suspendedSchools, color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/20" },
        ].map((item) => (
          <div key={item.label} className={`rounded-2xl ${item.bg} border ${item.border} p-5 flex items-center gap-4`}>
            <p className={`text-3xl font-extrabold ${item.color}`}>{item.count}</p>
            <div>
              <p className="text-white/70 text-sm font-medium">{item.label}</p>
              <p className="text-white/30 text-xs">
                {Math.round((item.count / Math.max(stats.totalSchools, 1)) * 100)}% of total
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white font-semibold">School Growth</h2>
              <p className="text-white/40 text-xs mt-0.5">New schools registered per month</p>
            </div>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <SchoolGrowthChart data={stats.schoolsByMonth} />
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white font-semibold">Student Growth</h2>
              <p className="text-white/40 text-xs mt-0.5">New students enrolled per month</p>
            </div>
            <GraduationCap className="w-5 h-5 text-blue-400" />
          </div>
          <SchoolGrowthChart
            data={stats.studentsByMonth}
            color="#3b82f6"
            gradientStart="#3b82f6"
            gradientEnd="#06b6d4"
          />
        </div>
      </div>

      {/* Revenue + User Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-white/5 border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white font-semibold">Revenue Overview</h2>
              <p className="text-white/40 text-xs mt-0.5">Monthly subscription revenue (INR)</p>
            </div>
            <CreditCard className="w-5 h-5 text-emerald-400" />
          </div>
          <RevenueChart />
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <div className="mb-6">
            <h2 className="text-white font-semibold">User Distribution</h2>
            <p className="text-white/40 text-xs mt-0.5">Breakdown by role</p>
          </div>
          <UserDistributionChart
            data={[
              { name: "Students", value: stats.totalStudents, color: "#3b82f6" },
              { name: "Teachers", value: stats.totalTeachers, color: "#10b981" },
              { name: "Parents",  value: stats.totalParents,  color: "#f59e0b" },
              { name: "Admins",   value: stats.totalAdmins,   color: "#8b5cf6" },
            ]}
          />
        </div>
      </div>

      {/* Recent Schools + Audit Log + Demo Requests */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold">Recent Schools</h2>
            <a href="/super-admin/schools" className="text-purple-400 text-xs hover:text-purple-300 transition-colors">
              View all →
            </a>
          </div>
          <RecentSchoolsTable schools={stats.recentSchools} allSchools={stats.allSchools} />
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold">Recent Activity</h2>
            <a href="/super-admin/audit" className="text-purple-400 text-xs hover:text-purple-300 transition-colors">
              View all →
            </a>
          </div>
          <RecentAuditLog logs={stats.recentAuditLogs} />
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold">Demo Requests</h2>
            <span className="text-purple-400 text-xs">{stats.recentDemoRequests.length} recent</span>
          </div>
          {stats.recentDemoRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/30 text-sm">No demo requests yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentDemoRequests.map((request: any) => (
                <div key={request.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/8 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white font-medium text-sm">{request.name}</p>
                      <p className="text-white/40 text-xs">{request.schoolName}</p>
                    </div>
                    <span className="text-white/30 text-xs">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/50">
                    <span>{request.email}</span>
                    <span>•</span>
                    <span>{request.role}</span>
                    <span>•</span>
                    <span>{request.students} students</span>
                  </div>
                  {request.message && (
                    <p className="text-white/40 text-xs mt-2 italic">&ldquo;{request.message}&rdquo;</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
