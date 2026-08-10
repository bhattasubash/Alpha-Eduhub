import Image from "next/image";
import CountChart from "./CountChart";
import prisma from "@/lib/prisma";
import { getCurrentSchoolId } from "@/lib/getRole";

const CountChartContainer = async () => {
  const schoolId = await getCurrentSchoolId();
  let boys  = 0;
  let girls = 0;

  try {
    [boys, girls] = await Promise.all([
      prisma.student.count({ where: { sex: "MALE",   ...(schoolId ? { schoolId } : {}) } }),
      prisma.student.count({ where: { sex: "FEMALE", ...(schoolId ? { schoolId } : {}) } }),
    ]);
  } catch {
    boys = 0; girls = 0;
  }

  const total = boys + girls || 1;

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Students</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <CountChart boys={boys} girls={girls} />
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaSky rounded-full" />
          <h1 className="font-bold">{boys}</h1>
          <h2 className="text-xs text-gray-300">Boys ({Math.round((boys / total) * 100)}%)</h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaYellow rounded-full" />
          <h1 className="font-bold">{girls}</h1>
          <h2 className="text-xs text-gray-300">Girls ({Math.round((girls / total) * 100)}%)</h2>
        </div>
      </div>
    </div>
  );
};

export default CountChartContainer;
