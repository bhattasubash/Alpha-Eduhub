import { redirect } from "next/navigation";
import Link from "next/link";
import { CreditCard, CheckCircle2, Clock, XCircle, AlertTriangle } from "lucide-react";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/getRole";

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 20;

interface PageProps {
  searchParams: { plan?: string; status?: string; page?: string };
}

const PLAN_COLORS: Record<string, string> = {
  FREE:         "text-white/40 bg-white/5 border-white/10",
  STARTER:      "text-blue-300 bg-blue-500/10 border-blue-500/20",
  PROFESSIONAL: "text-purple-300 bg-purple-500/10 border-purple-500/20",
  ENTERPRISE:   "text-amber-300 bg-amber-500/10 border-amber-500/20",
};

const PLAN_PRICES: Record<string, string> = {
  FREE: "₹0", STARTER: "₹25/mo", PROFESSIONAL: "₹30/mo", ENTERPRISE: "Custom",
};

export default async function SubscriptionsPage({ searchParams }: PageProps) {
  try {
    await requireSession(["SUPER_ADMIN"]);
  } catch {
    redirect("/sign-in");
  }

  const page   = parseInt(searchParams.page ?? "1");
  const plan   = searchParams.plan   ?? "";
  const status = searchParams.status ?? "";
  const skip   = (page - 1) * PAGE_SIZE;

  const where = {
    ...(plan   ? { subscriptionPlan:   plan   as "FREE" | "STARTER" | "PROFESSIONAL" | "ENTERPRISE" } : {}),
    ...(status ? { subscriptionStatus: status as "ACTIVE" | "EXPIRED" | "CANCELLED" | "TRIAL" }       : {}),
  };

  const [schools, total] = await Promise.all([
    prisma.school.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
      select: {
        id: true, name: true, email: true,
        subscriptionPlan: true, subscriptionStatus: true,
        subscriptionEndsAt: true, trialEndsAt: true, createdAt: true,
        _count: { select: { students: true } },
        subscription: {
          select: { id: true, expiresAt: true, status: true },
        },
      },
    }),
    prisma.school.count({ where }),
  ]);

  const [activeCount, trialCount, expiredCount] = await Promise.all([
    prisma.school.count({ where: { subscriptionStatus: "ACTIVE" } }),
    prisma.school.count({ where: { subscriptionStatus: "TRIAL" } }),
    prisma.school.count({ where: { subscriptionStatus: "EXPIRED" } }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Subscriptions</h1>
        <p className="text-white/40 text-sm mt-0.5">Manage school billing and plans</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Active",  count: activeCount,  cls: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
          { label: "Trial",   count: trialCount,   cls: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20"   },
          { label: "Expired", count: expiredCount, cls: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/20"     },
          { label: "Total",   count: total,        cls: "text-white/80",    bg: "bg-white/5",        border: "border-white/10"       },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl ${s.bg} border ${s.border} p-4 flex items-center gap-3`}>
            <p className={`text-2xl font-bold ${s.cls}`}>{s.count}</p>
            <p className="text-white/50 text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <form method="GET" className="flex flex-wrap gap-3">
        <select name="plan" defaultValue={plan}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500/30 cursor-pointer">
          <option value="">All Plans</option>
          <option value="FREE">Free</option>
          <option value="STARTER">Starter</option>
          <option value="PROFESSIONAL">Professional</option>
          <option value="ENTERPRISE">Enterprise</option>
        </select>
        <select name="status" defaultValue={status}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500/30 cursor-pointer">
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="TRIAL">Trial</option>
          <option value="EXPIRED">Expired</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <button type="submit" className="px-4 py-2.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm font-medium hover:bg-purple-600/30 transition-all">
          Filter
        </button>
      </form>

      {/* Table */}
      <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
        {schools.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <CreditCard className="w-12 h-12 text-white/10" />
            <p className="text-white/50">No subscriptions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-5 py-3.5 text-white/30 text-xs font-semibold uppercase tracking-wider">School</th>
                  <th className="text-left px-5 py-3.5 text-white/30 text-xs font-semibold uppercase tracking-wider">Plan</th>
                  <th className="text-left px-5 py-3.5 text-white/30 text-xs font-semibold uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3.5 text-white/30 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">Price</th>
                  <th className="text-left px-5 py-3.5 text-white/30 text-xs font-semibold uppercase tracking-wider hidden xl:table-cell">Expires</th>
                  <th className="text-left px-5 py-3.5 text-white/30 text-xs font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {schools.map((school) => (
                  <tr key={school.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-white/80 text-sm font-medium">{school.name}</p>
                        <p className="text-white/30 text-xs">{school.email ?? "—"}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${PLAN_COLORS[school.subscriptionPlan]}`}>
                        {school.subscriptionPlan}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-white/60 text-sm">{school.subscriptionStatus}</span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-white/60 text-sm">{PLAN_PRICES[school.subscriptionPlan]}</span>
                    </td>
                    <td className="px-5 py-4 hidden xl:table-cell">
                      <span className="text-white/40 text-xs">
                        {school.subscriptionEndsAt
                          ? new Date(school.subscriptionEndsAt).toLocaleDateString("en-IN")
                          : school.trialEndsAt
                          ? `Trial: ${new Date(school.trialEndsAt).toLocaleDateString("en-IN")}`
                          : "—"
                        }
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/super-admin/schools/${school.id}?tab=subscription`}
                        className="px-3 py-1.5 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-medium hover:bg-purple-600/30 transition-all"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-white/5">
            <p className="text-white/30 text-sm">{skip + 1}–{Math.min(skip + PAGE_SIZE, total)} of {total}</p>
            <div className="flex gap-2">
              {page > 1 && <a href={`?page=${page - 1}&plan=${plan}&status=${status}`} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10">← Prev</a>}
              {page < totalPages && <a href={`?page=${page + 1}&plan=${plan}&status=${status}`} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10">Next →</a>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
