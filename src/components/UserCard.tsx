import Image from "next/image";
import prisma from "@/lib/prisma";
import { getCurrentSchoolId } from "@/lib/getRole";

type CardType = "admin" | "teacher" | "student" | "parent";

const BG: Record<CardType, string> = {
  admin:   "bg-lamaSky",
  teacher: "bg-lamaPurple",
  student: "bg-lamaYellow",
  parent:  "bg-lamaPurpleLight",
};

const UserCard = async ({ type }: { type: CardType }) => {
  const schoolId = await getCurrentSchoolId();
  let count = 0;

  try {
    if (type === "admin")   count = await prisma.admin.count(  { where: schoolId ? { schoolId } : {} });
    if (type === "teacher") count = await prisma.teacher.count({ where: schoolId ? { schoolId } : {} });
    if (type === "student") count = await prisma.student.count({ where: schoolId ? { schoolId } : {} });
    if (type === "parent")  count = await prisma.parent.count( { where: schoolId ? { schoolId } : {} });
  } catch {
    count = 0;
  }

  return (
    <div className={`rounded-2xl ${BG[type]} p-4 flex-1 min-w-[130px]`}>
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          Live
        </span>
        <Image src="/more.png" alt="" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">{count.toLocaleString()}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-600">{type}s</h2>
    </div>
  );
};

export default UserCard;
