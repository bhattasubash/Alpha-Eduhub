import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import ImpersonationBanner from "@/components/ImpersonationBanner";
import { getActiveSchoolId, getSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const role = session?.role;

  if (!role || !session) {
    redirect("/sign-in");
  }

  const cookieStore = cookies();
  const isSchoolImpersonating = cookieStore.get("super_admin_impersonation")?.value === "true";
  const isDeepImpersonating = !!session.impersonatorId;
  const activeSchoolId = await getActiveSchoolId();

  let schoolName = "";
  if ((isSchoolImpersonating || isDeepImpersonating) && activeSchoolId) {
    const school = await prisma.school.findUnique({
      where: { id: activeSchoolId },
      select: { name: true },
    });
    if (school) schoolName = school.name;
  }

  const homeHref =
    role === "SUPER_ADMIN"  ? "/super-admin" :
    role === "provider"     ? "/provider"    :
    role === "SCHOOL_ADMIN" ? "/admin"       :
    role === "TEACHER"      ? "/teacher"     :
    role === "teacher"      ? "/teacher"     :
    role === "STUDENT"      ? "/student"     :
    role === "student"      ? "/student"     :
    role === "PARENT"       ? "/parent"      :
    `/${role}`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <ImpersonationBanner 
        isImpersonating={isSchoolImpersonating} 
        schoolName={schoolName} 
        isDeepImpersonating={isDeepImpersonating}
        impersonatedUsername={session.username}
      />
      
      <div className="flex-1 flex min-h-screen">
        {/* Modern Responsive Sidebar */}
        <aside className="w-16 lg:w-64 bg-white border-r border-slate-200/80 flex flex-col shrink-0 sticky top-0 h-screen overflow-y-auto scrollbar-clean">
          {/* Institution Header / Logo */}
          <div className="p-4 lg:px-5 lg:py-4.5 border-b border-slate-100 flex items-center justify-between">
            <Link
              href={homeHref}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
                <Image src="/logo.png" alt="logo" width={22} height={22} className="brightness-200" />
              </div>
              <div className="hidden lg:flex flex-col">
                <span className="font-bold text-sm text-slate-900 tracking-tight leading-tight">
                  Alpha EduHub
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                  Enterprise Suite
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 p-3 lg:px-4 py-4">
            <Menu />
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
          <Navbar />
          <main className="flex-1 p-4 lg:p-6 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
