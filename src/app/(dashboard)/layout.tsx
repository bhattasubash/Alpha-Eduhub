import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import ImpersonationBanner from "@/components/ImpersonationBanner";
import { getRole, getActiveSchoolId } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/getRole";

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
    role === "STUDENT"      ? "/student"     :
    role === "PARENT"       ? "/parent"      :
    `/${role}`;

  // Teachers have their own custom layout with single sidebar
  if (role === "TEACHER" || role === "teacher") {
    return (
      <div className="min-h-screen flex flex-col">
        <ImpersonationBanner 
          isImpersonating={isSchoolImpersonating} 
          schoolName={schoolName} 
          isDeepImpersonating={isDeepImpersonating}
          impersonatedUsername={session.username}
        />
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ImpersonationBanner 
        isImpersonating={isSchoolImpersonating} 
        schoolName={schoolName} 
        isDeepImpersonating={isDeepImpersonating}
        impersonatedUsername={session.username}
      />
      <div className="flex-1 h-screen flex">
        {/* Sidebar */}
        <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
          <Link
            href={homeHref}
            className="flex items-center justify-center lg:justify-start gap-2"
          >
            <Image src="/logo.png" alt="logo" width={32} height={32} />
            <span className="hidden lg:block font-bold text-base text-gray-800">
              Alpha Edu Hub
            </span>
          </Link>
          <Menu />
        </div>

        {/* Main content */}
        <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
          <Navbar />
          {children}
        </div>
      </div>
    </div>
  );
}

