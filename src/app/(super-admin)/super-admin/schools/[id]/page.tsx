import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Building2, Users, GraduationCap, BookOpen, Shield, CreditCard,
  CheckCircle2, XCircle, Clock, AlertTriangle, UserCheck, ArrowLeft, KeyRound, HardDrive, Globe, Calendar, Phone, Mail, MapPin
} from "lucide-react";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/getRole";
import SchoolActionsMenu from "@/components/super-admin/SchoolActionsMenu";
import CreateSchoolAdminForm from "@/components/super-admin/CreateSchoolAdminForm";

interface PageProps {
  params: { id: string };
}

export default async function SchoolDetailPage({ params }: PageProps) {
  try {
    await requireSession(["SUPER_ADMIN"]);
  } catch {
    redirect("/sign-in");
  }

  let school: any = null;
  let recentAuditLogs: any[] = [];

  try {
    school = await prisma.school.findUnique({
      where: { id: params.id },
      include: {
        admins: true,
        subscription: true,
        _count: {
          select: {
            students: true,
            teachers: true,
            parents: true,
            classes: true,
            subjects: true,
            users: true,
          },
        },
      },
    });

    if (school) {
      recentAuditLogs = await prisma.auditLog.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: "desc" },
        take: 10,
      });
    }
  } catch (error) {
    console.error("Database connection failed in SingleSchoolDetailPage:", error);
  }

  if (!school) {
    redirect("/super-admin/schools");
  }

  return (
    <div className="space-y-8">
      {/* Back button & Header */}
      <div>
        <Link
          href="/super-admin/schools"
          className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Schools
        </Link>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-xl">
              {school.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                {school.name}
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  school.status === "ACTIVE" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}>
                  {school.status}
                </span>
              </h1>
              <p className="text-white/40 text-sm mt-0.5 font-mono">School ID: {school.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <SchoolActionsMenu
              schoolId={school.id}
              schoolName={school.name}
              currentStatus={school.status}
            />
          </div>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
          <p className="text-white/40 text-xs font-medium">Students Enrolled</p>
          <p className="text-2xl font-bold text-blue-400">{school._count.students}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
          <p className="text-white/40 text-xs font-medium">Teaching Faculty</p>
          <p className="text-2xl font-bold text-emerald-400">{school._count.teachers}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
          <p className="text-white/40 text-xs font-medium">Subscription Tier</p>
          <p className="text-2xl font-bold text-amber-400">{school.subscriptionPlan}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
          <p className="text-white/40 text-xs font-medium">Storage Allocated</p>
          <p className="text-2xl font-bold text-purple-400">{school.storageUsedMb} MB / {school.storageLimitMb} MB</p>
        </div>
      </div>

      {/* Detail Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* School Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h2 className="text-white font-semibold text-base flex items-center gap-2">
              <Building2 className="w-4 h-4 text-purple-400" />
              School Details & Configuration
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2 text-white/70">
                <Mail className="w-4 h-4 text-white/40" />
                <span>Email: {school.email || "Not specified"}</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Phone className="w-4 h-4 text-white/40" />
                <span>Phone: {school.phone || "Not specified"}</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <MapPin className="w-4 h-4 text-white/40" />
                <span>Address: {school.address || "Not specified"}</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Globe className="w-4 h-4 text-white/40" />
                <span>Website: {school.website || "Not specified"}</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Calendar className="w-4 h-4 text-white/40" />
                <span>Academic Year: {school.academicYear || "Current"}</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Clock className="w-4 h-4 text-white/40" />
                <span>Timezone: {school.timezone || "UTC"}</span>
              </div>
            </div>
          </div>

          {/* School Admins */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold text-base flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" />
                Assigned School Admins
              </h2>
            </div>
            {school.admins.length === 0 ? (
              <p className="text-white/30 text-xs py-2">No admin account assigned yet.</p>
            ) : (
              <div className="space-y-2">
                {school.admins.map((adm: any) => (
                  <div key={adm.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <p className="text-white font-medium">{adm.username}</p>
                      <p className="text-white/40 font-mono text-[10px]">{adm.id}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-semibold">
                      School Admin
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Create Admin Form */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h2 className="text-white font-semibold text-base flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-purple-400" />
              Create School Admin
            </h2>
            <CreateSchoolAdminForm schoolId={school.id} schoolName={school.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
