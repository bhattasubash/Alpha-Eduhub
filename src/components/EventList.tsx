import prisma from "@/lib/prisma";
import { getCurrentSchoolId } from "@/lib/getRole";
import { Clock } from "lucide-react";

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {
  const schoolId = await getCurrentSchoolId();
  const selectedDate = dateParam ? new Date(dateParam) : new Date();

  // Build day range
  const start = new Date(selectedDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(selectedDate);
  end.setHours(23, 59, 59, 999);

  let data: { id: number; title: string; description: string; startTime: Date; endTime: Date }[] = [];

  try {
    data = await prisma.event.findMany({
      where: {
        startTime: { gte: start, lte: end },
        ...(schoolId ? { schoolId } : {}),
      },
      orderBy: { startTime: "asc" },
      select: { id: true, title: true, description: true, startTime: true, endTime: true },
    });
  } catch {
    // empty
  }

  if (data.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="text-xs text-slate-400 font-medium">No scheduled events for this date.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {data.map((event) => (
        <div
          key={event.id}
          className="p-3.5 rounded-lg border border-slate-200/80 bg-white hover:border-slate-300 transition-colors shadow-2xs"
        >
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold text-xs text-slate-800 tracking-tight">{event.title}</h4>
            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-500 bg-slate-50 border border-slate-200/70 px-2 py-0.5 rounded">
              <Clock className="w-3 h-3 text-slate-400" />
              {event.startTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false })}
            </span>
          </div>
          {event.description && (
            <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">{event.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default EventList;
