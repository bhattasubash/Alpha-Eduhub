import prisma from "@/lib/prisma";
import { getCurrentSchoolId } from "@/lib/getRole";
import { Users, GraduationCap, UserCheck, HeartHandshake } from "lucide-react";

type CardType = "admin" | "teacher" | "student" | "parent";

const METRICS_META: Record<
  CardType,
  { label: string; icon: typeof Users; accentBg: string; accentText: string; trend: string }
> = {
  admin: {
    label: "Administrators",
    icon: UserCheck,
    accentBg: "bg-blue-50 text-blue-700 border-blue-100",
    accentText: "text-blue-700",
    trend: "Active School Ops",
  },
  teacher: {
    label: "Teaching Faculty",
    icon: GraduationCap,
    accentBg: "bg-indigo-50 text-indigo-700 border-indigo-100",
    accentText: "text-indigo-700",
    trend: "Classroom Active",
  },
  student: {
    label: "Enrolled Students",
    icon: Users,
    accentBg: "bg-emerald-50 text-emerald-700 border-emerald-100",
    accentText: "text-emerald-700",
    trend: "Academic Year",
  },
  parent: {
    label: "Guardians & Parents",
    icon: HeartHandshake,
    accentBg: "bg-amber-50 text-amber-700 border-amber-100",
    accentText: "text-amber-700",
    trend: "Portal Connected",
  },
};

const UserCard = async ({ type }: { type: CardType }) => {
  const schoolId = await getCurrentSchoolId();
  let count = 0;

  try {
    if (type === "admin")   count = await prisma.admin.count({ where: schoolId ? { schoolId } : {} });
    if (type === "teacher") count = await prisma.teacher.count({ where: schoolId ? { schoolId } : {} });
    if (type === "student") count = await prisma.student.count({ where: schoolId ? { schoolId } : {} });
    if (type === "parent")  count = await prisma.parent.count({ where: schoolId ? { schoolId } : {} });
  } catch {
    count = 0;
  }

  const meta = METRICS_META[type];
  const Icon = meta.icon;

  return (
    <div className="bg-white rounded-xl border border-slate-200/85 p-5 flex-1 min-w-[140px] shadow-xs hover:shadow-card hover:border-slate-300 transition-all">
      <div className="flex justify-between items-start">
        <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${meta.accentBg}`}>
          <Icon className="w-4 h-4" strokeWidth={1.75} />
        </div>
        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100/80 border border-slate-200/60 px-2 py-0.5 rounded-full">
          {meta.trend}
        </span>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums">
          {count.toLocaleString()}
        </h3>
        <p className="text-xs font-medium text-slate-500 mt-1">
          {meta.label}
        </p>
      </div>
    </div>
  );
};

export default UserCard;
