import { redirect } from "next/navigation";
import { Megaphone, Plus } from "lucide-react";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/getRole";
import CreateAnnouncementForm from "@/components/super-admin/CreateAnnouncementForm";

export default async function AnnouncementsPage() {
  try {
    await requireSession(["SUPER_ADMIN"]);
  } catch {
    redirect("/sign-in");
  }

  const announcements = await prisma.platformAnnouncement.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const TYPE_COLORS: Record<string, string> = {
    INFO:        "text-blue-300 bg-blue-500/10 border-blue-500/20",
    WARNING:     "text-amber-300 bg-amber-500/10 border-amber-500/20",
    MAINTENANCE: "text-red-300 bg-red-500/10 border-red-500/20",
    FEATURE:     "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
  };

  const TYPE_EMOJIS: Record<string, string> = {
    INFO: "ℹ️", WARNING: "⚠️", MAINTENANCE: "🔧", FEATURE: "✨",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Platform Announcements</h1>
          <p className="text-white/40 text-sm mt-0.5">Broadcast messages to all schools</p>
        </div>
      </div>

      {/* Create form */}
      <CreateAnnouncementForm />

      {/* Existing announcements */}
      <div className="space-y-4">
        <h2 className="text-white/70 text-sm font-semibold uppercase tracking-wider">
          Previous Announcements
        </h2>
        {announcements.length === 0 ? (
          <div className="rounded-2xl bg-white/5 border border-white/10 py-12 text-center">
            <Megaphone className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/40 text-sm">No announcements sent yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="rounded-xl bg-white/5 border border-white/10 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{TYPE_EMOJIS[a.type] ?? "📢"}</span>
                      <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${TYPE_COLORS[a.type] ?? TYPE_COLORS["INFO"]}`}>
                        {a.type}
                      </span>
                      {a.targetAll && (
                        <span className="text-white/30 text-xs">All Schools</span>
                      )}
                    </div>
                    <h3 className="text-white/80 font-semibold">{a.title}</h3>
                    <p className="text-white/50 text-sm mt-1">{a.content}</p>
                    <div className="flex items-center gap-4 mt-2 text-white/25 text-xs">
                      <span>{new Date(a.createdAt).toLocaleString("en-IN")}</span>
                      {a.expiresAt && (
                        <span>Expires {new Date(a.expiresAt).toLocaleDateString("en-IN")}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
