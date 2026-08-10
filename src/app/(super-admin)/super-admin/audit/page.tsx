import { redirect } from "next/navigation";
import { ScrollText, Search } from "lucide-react";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/getRole";

const PAGE_SIZE = 30;

interface PageProps {
  searchParams: { search?: string; action?: string; page?: string };
}

const ACTION_ICONS: Record<string, string> = {
  CREATE_SCHOOL:      "🏫",
  DELETE_SCHOOL:      "🗑️",
  UPDATE_SCHOOL:      "✏️",
  SUSPEND_SCHOOL:     "⛔",
  ACTIVATE_SCHOOL:    "✅",
  CREATE_SCHOOL_ADMIN:"👤",
  FORCE_LOGOUT:       "🚪",
  RESET_PASSWORD:     "🔑",
  DELETE_USER:        "💀",
  SUSPEND_USER:       "🚫",
  UPDATE_SUBSCRIPTION:"💳",
  UPDATE_TICKET:      "🎫",
  CREATE_ANNOUNCEMENT:"📢",
  UPDATE_PLATFORM_SETTING:"⚙️",
};

export default async function AuditPage({ searchParams }: PageProps) {
  try {
    await requireSession(["SUPER_ADMIN"]);
  } catch {
    redirect("/sign-in");
  }

  const page   = parseInt(searchParams.page ?? "1");
  const search = searchParams.search ?? "";
  const action = searchParams.action ?? "";
  const skip   = (page - 1) * PAGE_SIZE;

  const where = {
    ...(search ? {
      OR: [
        { actorEmail: { contains: search, mode: "insensitive" as const } },
        { actorId:    { contains: search, mode: "insensitive" as const } },
        { entity:     { contains: search, mode: "insensitive" as const } },
      ],
    } : {}),
    ...(action ? { action } : {}),
  };

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
      include: { school: { select: { name: true } } },
    }),
    prisma.auditLog.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Unique actions for filter dropdown
  const actionTypes = await prisma.auditLog.groupBy({
    by: ["action"],
    orderBy: { action: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Audit Logs</h1>
        <p className="text-white/40 text-sm mt-0.5">
          Complete history of {total.toLocaleString()} platform actions
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <form method="GET" className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input name="search" defaultValue={search}
            placeholder="Search by actor or entity…"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/30" />
          {action && <input type="hidden" name="action" value={action} />}
        </form>
        <form method="GET" className="flex gap-2">
          {search && <input type="hidden" name="search" value={search} />}
          <select name="action" defaultValue={action}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500/30 cursor-pointer">
            <option value="">All Actions</option>
            {actionTypes.map((a) => (
              <option key={a.action} value={a.action}>{a.action.replace(/_/g, " ")}</option>
            ))}
          </select>
          <button type="submit" className="px-4 py-2.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm font-medium hover:bg-purple-600/30 transition-all">
            Filter
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <ScrollText className="w-12 h-12 text-white/10" />
            <p className="text-white/50">No audit logs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-5 py-3.5 text-white/30 text-xs font-semibold uppercase tracking-wider">Action</th>
                  <th className="text-left px-5 py-3.5 text-white/30 text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Entity</th>
                  <th className="text-left px-5 py-3.5 text-white/30 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">Actor</th>
                  <th className="text-left px-5 py-3.5 text-white/30 text-xs font-semibold uppercase tracking-wider hidden xl:table-cell">School</th>
                  <th className="text-left px-5 py-3.5 text-white/30 text-xs font-semibold uppercase tracking-wider">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{ACTION_ICONS[log.action] ?? "📝"}</span>
                        <span className="text-white/70 text-sm font-medium">
                          {log.action.replace(/_/g, " ")}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <div>
                        <span className="text-white/50 text-sm">{log.entity}</span>
                        {log.entityId && (
                          <span className="text-white/20 text-xs ml-2 font-mono">#{log.entityId.slice(0, 8)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <div>
                        <p className="text-white/60 text-sm">{log.actorEmail ?? log.actorId.slice(0, 12)}</p>
                        <p className="text-white/30 text-xs capitalize">{log.actorRole.toLowerCase()}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden xl:table-cell">
                      <span className="text-white/40 text-sm">{log.school?.name ?? "—"}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="text-white/60 text-xs">
                          {new Date(log.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </p>
                        <p className="text-white/30 text-xs">
                          {new Date(log.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                      </div>
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
              {page > 1 && (
                <a href={`?page=${page - 1}&search=${search}&action=${action}`}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10">← Prev</a>
              )}
              {page < totalPages && (
                <a href={`?page=${page + 1}&search=${search}&action=${action}`}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10">Next →</a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
