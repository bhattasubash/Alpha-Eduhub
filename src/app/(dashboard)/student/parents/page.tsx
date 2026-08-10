import prisma from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/getRole";
import ProfileNavigation from "@/components/student/ProfileNavigation";
import ParentCard from "@/components/student/ParentCard";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export const dynamic = 'force-dynamic';

const ParentsPage = async () => {
  const currentUserId = (await getCurrentUserId()) ?? "unknown";

  let student: any = null;

  try {
    student = await prisma.student.findUnique({
      where: { id: currentUserId },
      include: {
        parent: true,
      },
    });
  } catch (error) {
    console.error("Error fetching parent data:", error);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <ProfileNavigation />
      
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Parents & Guardians</h1>
          <p className="text-slate-600 dark:text-slate-400">View your parent/guardian information and contact details</p>
        </div>

        {student?.parent ? (
          <ParentCard
            parent={{
              ...student.parent,
              relationship: "Parent",
              accountStatus: "active",
            }}
          />
        ) : (
          <Card className="border-slate-200 dark:border-slate-700">
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">No parent information</h3>
              <p className="text-slate-600 dark:text-slate-400">Parent/guardian information will appear here once added by the school.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ParentsPage;
