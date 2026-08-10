import { redirect } from "next/navigation";
import { requireSession, getActiveSchoolId } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import SuperAdminSidebar from "@/components/super-admin/SuperAdminSidebar";
import SuperAdminTopbar from "@/components/super-admin/SuperAdminTopbar";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session;
  try {
    session = await requireSession(["SUPER_ADMIN"]);
  } catch {
    redirect("/sign-in");
  }

  const schools = await prisma.school.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const activeSchoolId = await getActiveSchoolId();

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f1a]">
      <div className="flex flex-1">
        <SuperAdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
          <SuperAdminTopbar
            username={session.username}
            schools={schools}
            activeSchoolId={activeSchoolId}
          />
          <main className="p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

