import { redirect } from "next/navigation";
import { HeadphonesIcon, AlertCircle, Clock, CheckCircle2, XCircle } from "lucide-react";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/getRole";
import TicketStatusButton from "@/components/super-admin/TicketStatusButton";

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 20;

interface PageProps {
  searchParams: { status?: string; priority?: string; page?: string };
}

const PRIORITY_COLORS: Record<string, string> = {
  LOW:      "text-white/40 bg-white/5 border-white/10",
  MEDIUM:   "text-blue-300 bg-blue-500/10 border-blue-500/20",
  HIGH:     "text-amber-300 bg-amber-500/10 border-amber-500/20",
  CRITICAL: "text-red-300 bg-red-500/10 border-red-500/20",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  OPEN:        <AlertCircle className="w-3 h-3" />,
  IN_PROGRESS: <Clock className="w-3 h-3" />,
  RESOLVED:    <CheckCircle2 className="w-3 h-3" />,
  CLOSED:      <XCircle className="w-3 h-3" />,
};

const STATUS_COLORS: Record<string, string> = {
  OPEN:        "text-red-400 bg-red-500/10 border-red-500/20",
  IN_PROGRESS: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  RESOLVED:    "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  CLOSED:      "text-white/40 bg-white/5 border-white/10",
};

export default async function SupportPage({ searchParams }: PageProps) {
  try {
    await requireSession(["SUPER_ADMIN"]);
  } catch {
    redirect("/sign-in");
  }

  const page     = parseInt(searchParams.page ?? "1");
  const status   = searchParams.status   ?? "";
  const priority = searchParams.priority ?? "";
  const skip     = (page - 1) * PAGE_SIZE;

  const where = {
    ...(status   ? { status:   status as "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" }   : {}),
    ...(priority ? { priority: priority as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" } : {}),
  };

  const [tickets, total, counts] = await Promise.all([
    prisma.supportTicket.findMany({
      where,
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      skip,
      take: PAGE_SIZE,
      include: {
        school: { select: { name: true } },
        _count: { select: { messages: true } },
      },
    }),
    prisma.supportTicket.count({ where }),
    Promise.all([
      prisma.supportTicket.count({ where: { status: "OPEN" } }),
      prisma.supportTicket.count({ where: { status: "IN_PROGRESS" } }),
      prisma.supportTicket.count({ where: { status: "RESOLVED" } }),
      prisma.supportTicket.count({ where: { status: "CLOSED" } }),
    ]),
  ]);

  const [openCount, inProgressCount, resolvedCount, closedCount] = counts;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Support Center</h1>
        <p className="text-white/40 text-sm mt-0.5">{total} tickets across all schools</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Open",        count: openCount,       href: "?status=OPEN",        cls: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/20"     },
          { label: "In Progress", count: inProgressCount, href: "?status=IN_PROGRESS", cls: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20"   },
          { label: "Resolved",    count: resolvedCount,   href: "?status=RESOLVED",    cls: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
          { label: "Closed",      count: closedCount,     href: "?status=CLOSED",      cls: "text-white/50",    bg: "bg-white/5",        border: "border-white/10"       },
        ].map((s) => (
          <a key={s.label} href={s.href}
            className={`rounded-xl ${s.bg} border ${s.border} p-4 flex items-center gap-3 hover:opacity-80 transition-opacity`}>
            <p className={`text-2xl font-bold ${s.cls}`}>{s.count}</p>
            <p className="text-white/50 text-sm">{s.label}</p>
          </a>
        ))}
      </div>

      {/* Filters */}
      <form method="GET" className="flex flex-wrap gap-3">
        <select name="status" defaultValue={status}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500/30 cursor-pointer">
          <option value="">All Status</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
        <select name="priority" defaultValue={priority}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500/30 cursor-pointer">
          <option value="">All Priority</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
        <button type="submit" className="px-4 py-2.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm font-medium hover:bg-purple-600/30 transition-all">
          Filter
        </button>
      </form>

      {/* Tickets */}
      <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <HeadphonesIcon className="w-12 h-12 text-white/10" />
            <p className="text-white/50">No tickets found</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="p-5 hover:bg-white/3 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${STATUS_COLORS[ticket.status]}`}>
                        {STATUS_ICONS[ticket.status]}{ticket.status.replace("_", " ")}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${PRIORITY_COLORS[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                      {ticket.school && (
                        <span className="text-white/30 text-xs">{ticket.school.name}</span>
                      )}
                    </div>
                    <h3 className="text-white/80 font-medium text-sm">{ticket.title}</h3>
                    <p className="text-white/40 text-xs mt-1 line-clamp-2">{ticket.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-white/25 text-xs">
                      <span>by {ticket.submittedByEmail ?? ticket.submittedById.slice(0, 8)}</span>
                      <span>{ticket._count.messages} messages</span>
                      <span>{new Date(ticket.createdAt).toLocaleDateString("en-IN")}</span>
                    </div>
                  </div>
                  <TicketStatusButton ticketId={ticket.id} currentStatus={ticket.status} />
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-white/5">
            <p className="text-white/30 text-sm">{skip + 1}–{Math.min(skip + PAGE_SIZE, total)} of {total}</p>
            <div className="flex gap-2">
              {page > 1 && <a href={`?page=${page - 1}&status=${status}&priority=${priority}`} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10">← Prev</a>}
              {page < totalPages && <a href={`?page=${page + 1}&status=${status}&priority=${priority}`} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10">Next →</a>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
