import prisma from "@/lib/prisma";
import { getCurrentSchoolId } from "@/lib/getRole";
import { Users, GraduationCap, UserCheck, HeartHandshake } from "lucide-react";

type CardType = "admin" | "teacher" | "student" | "parent";

const METRICS_META: Record<
  CardType,
  { label: string; icon: typeof Users; tag: string }
> = {
  admin: {
    label: "Administrators",
    icon: UserCheck,
    tag: "School Ops",
  },
  teacher: {
    label: "Teaching Faculty",
    icon: GraduationCap,
    tag: "Active Roster",
  },
  student: {
    label: "Enrolled Pupils",
    icon: Users,
    tag: "Full Cohort",
  },
  parent: {
    label: "Guardians & Parents",
    icon: HeartHandshake,
    tag: "Portal Connected",
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
    <div className="bg-paper-light rounded border-2 border-line p-5 flex-1 min-w-[140px] shadow-ledger">
      <div className="flex justify-between items-start pb-3 border-b border-line">
        <div className="w-8 h-8 rounded bg-paper border border-line flex items-center justify-center text-ledger">
          <Icon className="w-4 h-4" strokeWidth={1.75} />
        </div>
        <span className="text-[11px] font-mono font-bold text-brass-dark uppercase tracking-wider">
          {meta.tag}
        </span>
      </div>

      <div className="mt-4">
        <h3 className="text-3xl font-bold text-ink font-mono tracking-tight">
          {count.toLocaleString()}
        </h3>
        <p className="text-xs font-semibold text-ink-muted mt-1">
          {meta.label}
        </p>
      </div>
    </div>
  );
};

export default UserCard;
