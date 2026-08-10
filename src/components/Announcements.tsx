import prisma from "@/lib/prisma";
import { getCurrentSchoolId } from "@/lib/getRole";
import Link from "next/link";

const BG = ["bg-lamaSkyLight", "bg-lamaPurpleLight", "bg-lamaYellowLight"] as const;

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
    // empty — no crash
  }

  if (data.length === 0) {
    return (
      <div className="bg-white p-4 rounded-md">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Announcements</h1>
          <Link href="/list/announcements" className="text-xs text-gray-400 hover:underline">View All</Link>
        </div>
        <p className="text-sm text-gray-400 text-center py-6">No announcements yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <Link href="/list/announcements" className="text-xs text-gray-400 hover:underline">View All</Link>
      </div>
      <div className="flex flex-col gap-4">
        {data.map((item, i) => (
          <div key={item.id} className={`${BG[i % BG.length]} rounded-md p-4`}>
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-sm">{item.title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-GB").format(item.date)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1 line-clamp-2">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
