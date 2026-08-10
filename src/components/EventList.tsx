import prisma from "@/lib/prisma";
import { getCurrentSchoolId } from "@/lib/getRole";

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
    return <p className="text-sm text-gray-400 text-center py-4">No events for this day.</p>;
  }

  return (
    <>
      {data.map((event) => (
        <div
          key={event.id}
          className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
        >
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-gray-600">{event.title}</h1>
            <span className="text-gray-300 text-xs">
              {event.startTime.toLocaleTimeString("en-UK", { hour: "2-digit", minute: "2-digit", hour12: false })}
            </span>
          </div>
          <p className="mt-2 text-gray-400 text-sm line-clamp-2">{event.description}</p>
        </div>
      ))}
    </>
  );
};

export default EventList;
