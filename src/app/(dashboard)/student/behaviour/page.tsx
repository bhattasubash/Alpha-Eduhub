import prisma from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/getRole";
import ProfileNavigation from "@/components/student/ProfileNavigation";
import BehaviourTimeline from "@/components/student/BehaviourTimeline";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export const dynamic = 'force-dynamic';

const BehaviourPage = async () => {
  const currentUserId = (await getCurrentUserId()) ?? "unknown";

  let disciplines: any[] = [];

  try {
    disciplines = await prisma.discipline.findMany({
      where: { studentId: currentUserId },
      orderBy: {
        date: 'desc',
      },
    });
  } catch (error) {
    console.error("Error fetching behaviour data:", error);
  }

  const behaviourData = disciplines.map((discipline) => ({
    id: discipline.id,
    type: (discipline.type === 'POSITIVE' ? 'positive' : 'discipline') as "discipline" | "positive" | "achievement" | "observation",
    title: discipline.type === 'POSITIVE' ? 'Positive Behaviour' : 'Discipline Record',
    description: discipline.description || '',
    date: discipline.date.toISOString(),
    teacher: discipline.teacherId,
  }));

  const positiveCount = behaviourData.filter((b) => b.type === 'positive').length;
  const disciplineCount = behaviourData.filter((b) => b.type === 'discipline').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <ProfileNavigation />
      
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Behaviour & Achievements</h1>
          <p className="text-slate-600 dark:text-slate-400">Track your behaviour records and achievements</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
                  <Star className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">Positive Records</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">{positiveCount}</div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-amber-50 dark:bg-amber-950 rounded-lg">
                  <Star className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">Discipline Records</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">{disciplineCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Behaviour History</h2>
          <BehaviourTimeline items={behaviourData} />
        </div>
      </div>
    </div>
  );
};

export default BehaviourPage;
