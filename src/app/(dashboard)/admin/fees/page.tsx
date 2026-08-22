import { guardSchoolAdmin } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { GraduationCap, Users, DollarSign, ArrowRight } from "lucide-react";
import FeeManager from "@/components/admin/FeeManager";
import { getFeeStructures, getFeeRecords } from "@/lib/adminFeeActions";

export const dynamic = 'force-dynamic';

const AdminFeesPage = async ({
  searchParams,
}: {
  searchParams: { classId?: string };
}) => {
  const session = await guardSchoolAdmin();
  const schoolId = session.schoolId || "";
  const selectedClassId = searchParams.classId ? parseInt(searchParams.classId) : null;

  let classes: any[] = [];
  let structures: any[] = [];
  let records: Record<string, any> = {};
  let allStudents: any[] = [];

  try {
    classes = await prisma.class.findMany({
      where: schoolId ? { schoolId } : {},
      include: {
        grade: { select: { level: true } },
        _count: { select: { students: true } },
      },
      orderBy: [{ grade: { level: "asc" } }, { name: "asc" }],
    });

    [structures, records] = await Promise.all([
      getFeeStructures(schoolId),
      getFeeRecords(schoolId),
    ]);

    allStudents = await prisma.student.findMany({ where: schoolId ? { schoolId } : {}, select: { id: true } });
  } catch (err) {
    console.error("Error loading fee management page:", err);
  }

  // Count paid per class for sidebar badge
  const classPaidMap: Record<number, { paid: number; total: number }> = {};
  for (const cls of classes) {
    try {
      const studentsInClass = await prisma.student.findMany({
        where: { classId: cls.id, ...(schoolId ? { schoolId } : {}) },
        select: { id: true },
      });
      const paid = studentsInClass.filter((s) => records[s.id]?.status === "PAID").length;
      classPaidMap[cls.id] = { paid, total: studentsInClass.length };
    } catch {
      classPaidMap[cls.id] = { paid: 0, total: 0 };
    }
  }

  // Load students for selected class
  let students: { id: string; name: string; surname: string; username: string }[] = [];
  let selectedClass: (typeof classes)[number] | null = null;

  if (selectedClassId && schoolId) {
    try {
      selectedClass = classes.find((c) => c.id === selectedClassId) || null;
      if (selectedClass) {
        students = await prisma.student.findMany({
          where: { classId: selectedClassId, schoolId },
          select: { id: true, name: true, surname: true, username: true },
          orderBy: { name: "asc" },
        });
      }
    } catch (err) {
      console.error("Error loading class students for fees:", err);
    }
  }

  // Overall summary
  const totalCollected = allStudents.reduce((s, st) => s + (records[st.id]?.paidAmount ?? 0), 0);
  const totalPending   = allStudents.reduce((s, st) => {
    const r = records[st.id];
    return r ? s + (r.totalAmount - r.paidAmount) : s;
  }, 0);
  const paidCount = allStudents.filter((s) => records[s.id]?.status === "PAID").length;

  return (
    <div className="p-4 max-w-7xl mx-auto w-full space-y-5">
      {/* HEADER */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1>
              <p className="text-sm text-gray-500">Select a class → view students → assign &amp; collect fees</p>
            </div>
          </div>

          {/* School-wide summary */}
          <div className="flex gap-4 text-center">
            <div className="bg-emerald-50 px-4 py-2 rounded-xl">
              <p className="text-lg font-bold text-emerald-700">₹{totalCollected.toLocaleString("en-IN")}</p>
              <p className="text-[10px] font-bold text-emerald-500 uppercase">Collected</p>
            </div>
            <div className="bg-red-50 px-4 py-2 rounded-xl">
              <p className="text-lg font-bold text-red-600">₹{totalPending.toLocaleString("en-IN")}</p>
              <p className="text-[10px] font-bold text-red-400 uppercase">Pending</p>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-xl">
              <p className="text-lg font-bold text-blue-700">{paidCount}/{allStudents.length}</p>
              <p className="text-[10px] font-bold text-blue-400 uppercase">Paid</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* LEFT: CLASS SELECTOR */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden self-start">
          <div className="p-4 border-b border-gray-50">
            <h2 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-500" />
              Classes ({classes.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-50 max-h-[70vh] overflow-y-auto">
            {classes.length === 0 && (
              <div className="p-8 text-center">
                <GraduationCap className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                <p className="text-xs text-gray-400">No classes yet.</p>
                <Link href="/list/classes" className="text-xs text-blue-500 hover:underline mt-1 block">Create a class →</Link>
              </div>
            )}
            {classes.map((cls) => {
              const isActive = selectedClassId === cls.id;
              const summary = classPaidMap[cls.id] ?? { paid: 0, total: cls._count.students };
              return (
                <Link
                  key={cls.id}
                  href={`/admin/fees?classId=${cls.id}`}
                  className={`flex items-center justify-between p-3.5 hover:bg-gray-50 transition-colors group ${
                    isActive ? "bg-emerald-50 border-l-4 border-emerald-500" : ""
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold
                      ${isActive ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-600"}`}>
                      {cls.name.charAt(0)}
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${isActive ? "text-emerald-700" : "text-gray-800"}`}>
                        Class {cls.name}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        Gr.{cls.grade?.level} · {summary.paid}/{summary.total} paid
                      </p>
                    </div>
                  </div>
                  <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-emerald-400" : "text-gray-300 group-hover:text-gray-400"}`} />
                </Link>
              );
            })}
          </div>
        </div>

        {/* RIGHT: FEE MANAGER */}
        <div className="lg:col-span-3">
          {!selectedClassId ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center p-16 text-center min-h-[400px]">
              <div className="w-24 h-24 rounded-3xl bg-emerald-50 flex items-center justify-center mb-5">
                <DollarSign className="w-12 h-12 text-emerald-200" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Select a Class to Begin</h3>
              <p className="text-gray-500 text-sm mt-2 max-w-sm">
                Choose a class from the left panel to manage fee structures and student payments.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-gray-400 max-w-sm w-full">
                {["1. Create fee structure", "2. Assign to class or student", "3. Record payments"].map((s, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3 text-center font-semibold">{s}</div>
                ))}
              </div>
            </div>
          ) : (
            <FeeManager
              students={students}
              classId={selectedClassId}
              className={selectedClass?.name ?? ""}
              gradeLevel={selectedClass?.grade?.level ?? 0}
              structures={structures}
              records={records}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFeesPage;
