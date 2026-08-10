import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Building2, Plus, Search, Filter, MoreVertical,
  CheckCircle2, XCircle, Clock, AlertTriangle, Eye,
  Users, GraduationCap, CreditCard,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/getRole";
import SchoolActionsMenu from "@/components/super-admin/SchoolActionsMenu";
import CreateSchoolModal from "@/components/super-admin/CreateSchoolModal";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusBadge(status: string) {
  const map: Record<string, { cls: string; icon: React.ReactNode }> = {
    ACTIVE:    { cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: <CheckCircle2 className="w-3 h-3" /> },
    SUSPENDED: { cls: "text-red-400 bg-red-500/10 border-red-500/20",             icon: <XCircle className="w-3 h-3" /> },
    TRIAL:     { cls: "text-amber-400 bg-amber-500/10 border-amber-500/20",       icon: <Clock className="w-3 h-3" /> },
    INACTIVE:  { cls: "text-white/40 bg-white/5 border-white/10",                 icon: <AlertTriangle className="w-3 h-3" /> },
  };
  const s = map[status] ?? map["INACTIVE"];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${s.cls}`}>
      {s.icon}{status}
    </span>
  );
}

function planBadge(plan: string) {
  const map: Record<string, string> = {
    FREE:         "text-white/40 bg-white/5",
    STARTER:      "text-blue-300 bg-blue-500/10",
    PROFESSIONAL: "text-purple-300 bg-purple-500/10",
    ENTERPRISE:   "text-amber-300 bg-amber-500/10",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[plan] ?? map["FREE"]}`}>
      {plan}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface PageProps {
  searchParams: { search?: string; status?: string; plan?: string; page?: string };
}

const PAGE_SIZE = 20;

export default async function SchoolsPage({ searchParams }: PageProps) {
  try {
    await requireSession(["SUPER_ADMIN"]);
  } catch {
    redirect("/sign-in");
  }

  const page   = parseInt(searchParams.page ?? "1");
  const search = searchParams.search ?? "";
  const status = searchParams.status ?? "";
  const plan   = searchParams.plan   ?? "";
  const skip   = (page - 1) * PAGE_SIZE;

  const where = {
    ...(search ? {
      OR: [
        { name:    { contains: search, mode: "insensitive" as const } },
        { email:   { contains: search, mode: "insensitive" as const } },
        { address: { contains: search, mode: "insensitive" as const } },
      ],
    } : {}),
    ...(status ? { status: status as "ACTIVE" | "SUSPENDED" | "TRIAL" | "INACTIVE" } : {}),
    ...(plan   ? { subscriptionPlan: plan as "FREE" | "STARTER" | "PROFESSIONAL" | "ENTERPRISE" } : {}),
  };

  const [schools, total] = await Promise.all([
    prisma.school.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
      select: {
        id: true, name: true, email: true, phone: true, address: true,
        status: true, createdAt: true, subscriptionPlan: true,
        subscriptionStatus: true, storageUsedMb: true, storageLimitMb: true,
        _count: { select: { students: true, teachers: true, users: true } },
      },
    }),
    prisma.school.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Summary counts
  const [activeCount, suspendedCount, trialCount] = await Promise.all([
    prisma.school.count({ where: { status: "ACTIVE" } }),
    prisma.school.count({ where: { status: "SUSPENDED" } }),
    prisma.school.count({ where: { status: "TRIAL" } }),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">Schools</h1>
          <p className="text-white/40 text-sm mt-0.5">{total} schools registered on the platform</p>
        </div>
        <CreateSchoolModal />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total",     count: total,          cls: "text-white/80",    bg: "bg-white/5",          border: "border-white/10",        href: "?status=" },
          { label: "Active",    count: activeCount,    cls: "text-emerald-400", bg: "bg-emerald-500/10",   border: "border-emerald-500/20",   href: "?status=ACTIVE" },
          { label: "Trial",     count: trialCount,     cls: "text-amber-400",   bg: "bg-amber-500/10",     border: "border-amber-500/20",     href: "?status=TRIAL" },
          { label: "Suspended", count: suspendedCount, cls: "text-red-400",     bg: "bg-red-500/10",       border: "border-red-500/20",       href: "?status=SUSPENDED" },
        ].map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`rounded-xl ${s.bg} border ${s.border} p-4 flex items-center gap-3 hover:opacity-80 transition-opacity`}
          >
            <p className={`text-2xl font-bold ${s.cls}`}>{s.count}</p>
            <p className="text-white/50 text-sm">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <form method="GET" className="flex-1 min-w-[200px] max-w-xs relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            name="search"
            defaultValue={search}
            placeholder="Search schools…"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          />
        </form>

        <form method="GET" className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-white/30" />
          <select
            name="status"
            defaultValue={status}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500/30 cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="TRIAL">Trial</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <select
            name="plan"
            defaultValue={plan}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500/30 cursor-pointer"
          >
            <option value="">All Plans</option>
            <option value="FREE">Free</option>
            <option value="STARTER">Starter</option>
            <option value="PROFESSIONAL">Professional</option>
            <option value="ENTERPRISE">Enterprise</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm font-medium hover:bg-purple-600/30 transition-all"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
        {schools.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Building2 className="w-12 h-12 text-white/10" />
            <p className="text-white/50 font-medium">No schools found</p>
            <p className="text-white/30 text-sm">
              {search || status || plan ? "Try adjusting your filters." : "Create the first school to get started."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-5 py-3.5 text-white/30 text-xs font-semibold uppercase tracking-wider">School</th>
                  <th className="text-left px-5 py-3.5 text-white/30 text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Status</th>
                  <th className="text-left px-5 py-3.5 text-white/30 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">Plan</th>
                  <th className="text-left px-5 py-3.5 text-white/30 text-xs font-semibold uppercase tracking-wider hidden xl:table-cell">Users</th>
                  <th className="text-left px-5 py-3.5 text-white/30 text-xs font-semibold uppercase tracking-wider hidden xl:table-cell">Storage</th>
                  <th className="text-left px-5 py-3.5 text-white/30 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Created</th>
                  <th className="px-5 py-3.5 text-white/30 text-xs font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {schools.map((school) => {
                  const storagePercent = Math.min(
                    Math.round((school.storageUsedMb / Math.max(school.storageLimitMb, 1)) * 100),
                    100,
                  );
                  return (
                    <tr key={school.id} className="hover:bg-white/3 transition-colors group">
                      {/* School name + contact */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600/30 to-indigo-600/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-purple-300 text-xs font-bold">
                              {school.name.slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <Link
                              href={`/super-admin/schools/${school.id}`}
                              className="text-white/80 text-sm font-medium hover:text-white transition-colors"
                            >
                              {school.name}
                            </Link>
                            {school.email && (
                              <p className="text-white/30 text-xs">{school.email}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 hidden md:table-cell">
                        {statusBadge(school.status)}
                      </td>

                      {/* Plan */}
                      <td className="px-5 py-4 hidden lg:table-cell">
                        {planBadge(school.subscriptionPlan)}
                      </td>

                      {/* Users */}
                      <td className="px-5 py-4 hidden xl:table-cell">
                        <div className="flex items-center gap-3 text-xs text-white/40">
                          <span className="flex items-center gap-1">
                            <GraduationCap className="w-3 h-3" />
                            {school._count.students}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {school._count.teachers}
                          </span>
                        </div>
                      </td>

                      {/* Storage */}
                      <td className="px-5 py-4 hidden xl:table-cell">
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-white/30">{school.storageUsedMb}MB</span>
                            <span className="text-white/20">/{school.storageLimitMb}MB</span>
                          </div>
                          <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${storagePercent > 80 ? "bg-red-500" : storagePercent > 60 ? "bg-amber-500" : "bg-purple-500"}`}
                              style={{ width: `${storagePercent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Created */}
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <span className="text-white/40 text-xs">
                          {new Date(school.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <SchoolActionsMenu
                          schoolId={school.id}
                          schoolName={school.name}
                          currentStatus={school.status}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-white/5">
            <p className="text-white/30 text-sm">
              Showing {skip + 1}–{Math.min(skip + PAGE_SIZE, total)} of {total}
            </p>
            <div className="flex items-center gap-2">
              {page > 1 && (
                <Link
                  href={`?page=${page - 1}&search=${search}&status=${status}&plan=${plan}`}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 transition-all"
                >
                  Previous
                </Link>
              )}
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const p = i + 1;
                return (
                  <Link
                    key={p}
                    href={`?page=${p}&search=${search}&status=${status}&plan=${plan}`}
                    className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center transition-all ${
                      p === page
                        ? "bg-purple-600 text-white font-semibold"
                        : "bg-white/5 border border-white/10 text-white/40 hover:bg-white/10"
                    }`}
                  >
                    {p}
                  </Link>
                );
              })}
              {page < totalPages && (
                <Link
                  href={`?page=${page + 1}&search=${search}&status=${status}&plan=${plan}`}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 transition-all"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
