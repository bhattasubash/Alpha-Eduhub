import { redirect } from "next/navigation";
import { requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import { Database, HardDrive, Server, Activity, CheckCircle2, ShieldCheck, HardDriveDownload } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function DatabaseHealthPage() {
  try {
    await requireSession(["SUPER_ADMIN"]);
  } catch {
    redirect("/sign-in");
  }

  // Ping database & measure query latency
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

  // Fetch row counts for key database tables
  let schoolCount = 0, userCount = 0, studentCount = 0, teacherCount = 0, parentCount = 0;
  let auditCount = 0, tokenCount = 0, paymentCount = 0, invoiceCount = 0, feeCount = 0;
  let schoolsStorage: any[] = [];

  try {
    const counts = await Promise.all([
      prisma.school.count(),
      prisma.user.count(),
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.parent.count(),
      prisma.auditLog.count(),
      prisma.refreshToken.count(),
      prisma.payment.count(),
      prisma.invoice.count(),
      // @ts-ignore
      prisma.feeStructure.count(),
      prisma.school.findMany({
        select: {
          id: true,
          name: true,
          storageUsedMb: true,
          storageLimitMb: true,
          subscriptionPlan: true,
          status: true,
        },
        orderBy: { storageUsedMb: "desc" },
      }),
    ]);
    [
      schoolCount, userCount, studentCount, teacherCount, parentCount,
      auditCount, tokenCount, paymentCount, invoiceCount, feeCount,
      schoolsStorage,
    ] = counts;
  } catch (error) {
    console.error("Database connection failed in DatabaseMonitoringPage:", error);
  }

  const totalStorageUsedMb = schoolsStorage.reduce((acc, s) => acc + (s.storageUsedMb || 0), 0);

  const tableStats = [
    { name: "Schools", count: schoolCount, color: "text-purple-400" },
    { name: "Users", count: userCount, color: "text-blue-400" },
    { name: "Students", count: studentCount, color: "text-emerald-400" },
    { name: "Teachers", count: teacherCount, color: "text-amber-400" },
    { name: "Parents", count: parentCount, color: "text-indigo-400" },
    { name: "Audit Logs", count: auditCount, color: "text-pink-400" },
    { name: "Refresh Tokens", count: tokenCount, color: "text-red-400" },
    { name: "Fee Payments", count: paymentCount, color: "text-teal-400" },
    { name: "Invoices", count: invoiceCount, color: "text-cyan-400" },
    { name: "Fee Structures", count: feeCount, color: "text-violet-400" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-purple-400" />
            Database & Storage Health Dashboard
          </h1>
          <p className="text-white/40 text-sm mt-0.5">
            Monitor real-time database latency, schema metrics, and tenant storage allocation
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
          <span className="text-purple-300 text-xs font-semibold">PostgreSQL Engine</span>
        </div>
      </div>

      {/* Latency & Connectivity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-white/40 text-xs font-semibold">
            <span>Connection Status</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-400">
            {dbOk ? "Healthy / Online" : "Degraded"}
          </p>
          <p className="text-white/40 text-xs">Primary PostgreSQL Cluster</p>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-white/40 text-xs font-semibold">
            <span>Query Ping Latency</span>
            <Server className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-extrabold text-blue-400">
            {dbLatencyMs} ms
          </p>
          <p className="text-white/40 text-xs">Round-trip database query latency</p>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-white/40 text-xs font-semibold">
            <span>Total Tenant Storage</span>
            <HardDrive className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-extrabold text-purple-400">
            {totalStorageUsedMb} MB
          </p>
          <p className="text-white/40 text-xs">Utilized across all registered schools</p>
        </div>
      </div>

      {/* Database Table Row Metrics */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <h2 className="text-white font-semibold text-base flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          Database Model & Table Row Counts
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {tableStats.map((tbl) => (
            <div key={tbl.name} className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <p className="text-white/50 text-xs font-medium">{tbl.name}</p>
              <p className={`text-xl font-bold ${tbl.color}`}>{tbl.count.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tenant Storage Allocation Table */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold text-base flex items-center gap-2">
            <HardDriveDownload className="w-4 h-4 text-purple-400" />
            School Storage Usage Breakdown
          </h2>
          <span className="text-white/40 text-xs">Top schools by storage size</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white/70">
            <thead className="bg-white/5 text-white/40 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">School Name</th>
                <th className="p-3">Subscription</th>
                <th className="p-3">Status</th>
                <th className="p-3">Storage Used</th>
                <th className="p-3">Limit</th>
                <th className="p-3 rounded-r-xl">Usage %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {schoolsStorage.map((school) => {
                const used = school.storageUsedMb || 0;
                const limit = school.storageLimitMb || 512;
                const pct = Math.min(100, Math.round((used / Math.max(limit, 1)) * 100));

                return (
                  <tr key={school.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-semibold text-white">{school.name}</td>
                    <td className="p-3 capitalize">{school.subscriptionPlan.toLowerCase()}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        school.status === "ACTIVE" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}>
                        {school.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono">{used} MB</td>
                    <td className="p-3 font-mono">{limit} MB</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-white/10 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              pct > 80 ? "bg-red-500" : pct > 50 ? "bg-amber-500" : "bg-purple-500"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-white/50">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
