import { redirect } from "next/navigation";
import { Users, Shield, GraduationCap, BookOpen, ChevronDown, CheckCircle } from "lucide-react";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/getRole";
import UserActionsMenu from "@/components/super-admin/UserActionsMenu";
import SchoolSelector from "@/components/super-admin/SchoolSelector";

import Link from "next/link";

interface PageProps {
  searchParams: { schoolId?: string; purge?: string };
}

const ROLE_COLORS: Record<string, string> = {
  Admin:   "text-blue-300   bg-blue-500/10   border-blue-500/20",
  Teacher: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
  Student: "text-amber-300  bg-amber-500/10  border-amber-500/20",
  Parent:  "text-rose-300   bg-rose-500/10   border-rose-500/20",
};

// --- Sub-components ---

function AccordionSection({ title, count, icon: Icon, children, defaultOpen = false }: any) {
  return (
    <details open={defaultOpen} className="group bg-white/5 border border-white/10 rounded-2xl [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex items-center justify-between p-4 cursor-pointer select-none hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10">
            <Icon className="w-5 h-5 text-white/70" />
          </div>
          <h3 className="font-semibold text-white text-lg">{title}</h3>
          <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/5 text-white/70 text-xs font-semibold">
            {count}
          </span>
        </div>
        <div className="text-white/30 group-open:rotate-180 transition-transform duration-200">
          <ChevronDown className="w-5 h-5" />
        </div>
      </summary>
      <div className="p-1 border-t border-white/5 bg-black/20">
        {children}
      </div>
    </details>
  );
}

function UserTable({ users, roleBadge }: { users: any[], roleBadge: string }) {
  if (users.length === 0) return <p className="text-white/30 text-sm text-center py-8">No users in this category.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 text-white/30 text-xs uppercase tracking-wider">
            <th className="px-5 py-3 font-medium">User Profile</th>
            <th className="px-5 py-3 font-medium hidden md:table-cell">Contact Info</th>
            <th className="px-5 py-3 font-medium hidden sm:table-cell">Session Status</th>
            <th className="px-5 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {users.map(u => (
            <tr key={u.id} className="hover:bg-white/3 transition-colors">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/20 to-indigo-600/10 flex items-center justify-center border border-purple-500/20 flex-shrink-0">
                    <span className="text-purple-300 text-sm font-bold">{u.username.substring(0,2).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/90">{u.username}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${ROLE_COLORS[roleBadge]}`}>
                      {roleBadge}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4 hidden md:table-cell text-sm text-white/60">
                {u.email || <span className="italic opacity-50">No email provided</span>}
              </td>
              <td className="px-5 py-4 hidden sm:table-cell">
                {u.refreshTokens?.length > 0 ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]"></span>
                    Suspended
                  </span>
                )}
              </td>
              <td className="px-5 py-4 text-right">
                <div className="flex justify-end">
                  <UserActionsMenu userId={u.id} username={u.username} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- Main Page ---

export default async function UsersPage({ searchParams }: PageProps) {
  try {
    await requireSession(["SUPER_ADMIN"]);
  } catch {
    redirect("/sign-in");
  }

  const schoolId = searchParams.schoolId ?? "";
  
  // 1. Fetch schools for selector
  const schools = await prisma.school.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });

  let groupedUsers = {
    admins: [] as any[],
    teachers: [] as any[],
    parents: [] as any[],
    studentsByClass: {} as Record<string, any[]>,
  };

  let selectedSchoolName = "";

  // 2. Fetch users for the selected school
  if (schoolId) {
    const [users, studentRecords, school] = await Promise.all([
      prisma.user.findMany({
        where: { schoolId },
        include: { refreshTokens: { select: { id: true }, take: 1 } },
        orderBy: { username: "asc" }
      }),
      prisma.student.findMany({
        where: { schoolId },
        include: { class: true }
      }),
      prisma.school.findUnique({ where: { id: schoolId }, select: { name: true } })
    ]);

    if (school) selectedSchoolName = school.name;
    const studentMap = new Map(studentRecords.map(s => [s.id, s]));

    for (const u of users) {
      const role = u.role.toLowerCase();
      if (role === "admin" || u.role === "SCHOOL_ADMIN") {
        groupedUsers.admins.push(u);
      } else if (role === "teacher") {
        groupedUsers.teachers.push(u);
      } else if (role === "parent") {
        groupedUsers.parents.push(u);
      } else if (role === "student") {
        const studentDetails = studentMap.get(u.id);
        const className = studentDetails?.class?.name || "Unassigned";
        if (!groupedUsers.studentsByClass[className]) {
          groupedUsers.studentsByClass[className] = [];
        }
        groupedUsers.studentsByClass[className].push(u);
      }
    }
  }

  const classNames = Object.keys(groupedUsers.studentsByClass).sort();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header & Selector */}
      <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] p-6 rounded-2xl border border-white/10 shadow-2xl flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">User Hierarchy</h1>
          <p className="text-white/40 text-sm mt-1">Browse categorized users by school, role, and class.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          {schoolId && (
            <Link
              href={`/super-admin/users?purge=true`}
              className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium transition-all"
            >
              Purge Demo Data
            </Link>
          )}
          <div className="flex-1 md:flex-none">
            <SchoolSelector schools={schools} currentSchoolId={schoolId} />
          </div>
        </div>
      </div>

      {!schoolId ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white/5 border border-white/5 rounded-2xl shadow-inner">
          <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-6 border border-purple-500/20">
            <Users className="w-10 h-10 text-purple-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Select a Target School</h2>
          <p className="text-white/40 text-sm max-w-sm text-center">
            Choose a school from the dropdown above to securely load its categorized users, admins, teachers, and students.
          </p>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 px-2 py-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <p className="text-emerald-400 text-sm font-semibold tracking-wide uppercase">Viewing {selectedSchoolName}</p>
          </div>
          
          {/* Admins */}
          <AccordionSection title="School Admins" count={groupedUsers.admins.length} icon={Shield} defaultOpen={true}>
            <UserTable users={groupedUsers.admins} roleBadge="Admin" />
          </AccordionSection>

          {/* Teachers */}
          <AccordionSection title="Teachers" count={groupedUsers.teachers.length} icon={BookOpen}>
            <UserTable users={groupedUsers.teachers} roleBadge="Teacher" />
          </AccordionSection>

          {/* Parents */}
          <AccordionSection title="Parents" count={groupedUsers.parents.length} icon={Users}>
            <UserTable users={groupedUsers.parents} roleBadge="Parent" />
          </AccordionSection>

          {/* Students Categorized by Class */}
          <div className="pt-4">
            <div className="flex items-center gap-3 mb-4 px-2">
              <GraduationCap className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold text-white">Students by Class</h2>
            </div>
            
            {classNames.length === 0 ? (
              <div className="p-8 text-center bg-white/5 border border-white/10 rounded-2xl text-white/40 text-sm">
                No students enrolled in this school.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {classNames.map((className) => (
                  <AccordionSection 
                    key={className} 
                    title={`Class: ${className}`} 
                    count={groupedUsers.studentsByClass[className].length} 
                    icon={CheckCircle}
                  >
                    <UserTable users={groupedUsers.studentsByClass[className]} roleBadge="Student" />
                  </AccordionSection>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
