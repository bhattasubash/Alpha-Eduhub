import prisma from "@/lib/prisma";
import { getCurrentSchoolId } from "@/lib/getRole";
import Link from "next/link";
import { Megaphone, ArrowUpRight } from "lucide-react";

const Announcements = async () => {
  const schoolId = await getCurrentSchoolId();
  let data: { id: number; title: string; description: string; date: Date }[] = [];

  try {
    data = await prisma.announcement.findMany({
      where:   schoolId ? { schoolId } : {},
      orderBy: { date: "desc" },
      take:    3,
      select:  { id: true, title: true, description: true, date: true },
    });
  } catch {
    // empty
  }

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
            <Megaphone className="w-3.5 h-3.5" strokeWidth={2} />
          </div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Announcements</h2>
        </div>
        <Link
          href="/list/announcements"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <span>View All</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {data.length === 0 ? (
        <div className="py-8 text-center bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
          <p className="text-xs text-slate-400 font-medium">No published announcements.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50/70 hover:bg-slate-50 rounded-lg p-3.5 border border-slate-200/60 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-xs text-slate-800 tracking-tight">{item.title}</h3>
                <span className="font-mono text-[10px] text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                  {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" }).format(item.date)}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;
