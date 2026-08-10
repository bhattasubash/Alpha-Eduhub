import Image from "next/image";
import AttendanceChart from "./AttendanceChart";
import prisma from "@/lib/prisma";
import { getCurrentSchoolId } from "@/lib/getRole";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;
const DAY_MAP: Record<string, string> = {
  "1": "Mon", "2": "Tue", "3": "Wed", "4": "Thu", "5": "Fri",
};

const AttendanceChartContainer = async () => {
  const schoolId = await getCurrentSchoolId();

  // Get attendance records for the current week (Mon–Fri)
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon …
  const daysFromMon = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysFromMon);
  monday.setHours(0, 0, 0, 0);
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  friday.setHours(23, 59, 59, 999);

  let chartData: { name: string; present: number; absent: number }[] = DAYS.map((d) => ({
    name: d, present: 0, absent: 0,
  }));

  try {
    const records = await prisma.attendance.findMany({
      where: {
        date: { gte: monday, lte: friday },
        ...(schoolId ? { schoolId } : {}),
      },
      select: { date: true, present: true },
    });

    // Group by weekday
    const grouped: Record<string, { present: number; absent: number }> = {};
    DAYS.forEach((d) => { grouped[d] = { present: 0, absent: 0 }; });

    for (const r of records) {
      const jsDay = String(new Date(r.date).getDay()); // 1=Mon…5=Fri
      const label = DAY_MAP[jsDay];
      if (!label) continue;
      if (r.present) grouped[label].present++;
      else           grouped[label].absent++;
    }

    chartData = DAYS.map((d) => ({ name: d, ...grouped[d] }));
  } catch {
    // fallback zeros already set
  }

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Attendance — This Week</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <AttendanceChart data={chartData} />
    </div>
  );
};

export default AttendanceChartContainer;
