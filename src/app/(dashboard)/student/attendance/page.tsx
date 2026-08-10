import prisma from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/getRole";
import ProfileNavigation from "@/components/student/ProfileNavigation";
import AttendanceWithThreshold from "@/components/student/AttendanceWithThreshold";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle2, XCircle } from "lucide-react";

export const dynamic = 'force-dynamic';

const AttendancePage = async () => {
  const currentUserId = (await getCurrentUserId()) ?? "unknown";

  let attendanceData: any[] = [];

  try {
    attendanceData = await prisma.attendance.findMany({
      where: { studentId: currentUserId },
      orderBy: { date: 'desc' },
    });
  } catch (error) {
    console.error("Error fetching attendance data:", error);
  }

  // Calculate metrics
  const totalDays = attendanceData.length;
  const presentDays = attendanceData.filter((day) => day.present).length;
  const absentDays = attendanceData.filter((day) => !day.present).length;
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
  const attendanceThreshold = 75;

  // Group by month for heatmap
  const monthlyData = attendanceData.reduce((acc, record) => {
    const month = new Date(record.date).toLocaleString('default', { month: 'short', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = { present: 0, absent: 0, total: 0 };
    }
    acc[month].total += 1;
    if (record.present) acc[month].present += 1;
    if (!record.present) acc[month].absent += 1;
    return acc;
  }, {} as Record<string, { present: number; absent: number; total: number }>);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <ProfileNavigation />
      
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Attendance</h1>
          <p className="text-slate-600 dark:text-slate-400">Track your attendance record throughout the academic year</p>
        </div>

        {/* Attendance with Threshold */}
        <AttendanceWithThreshold
          percentage={attendancePercentage}
          present={presentDays}
          absent={absentDays}
          total={totalDays}
          threshold={attendanceThreshold}
          upcomingClasses={30}
        />

        {/* Monthly Breakdown */}
        <Card className="border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Monthly Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(monthlyData).length > 0 ? (
                Object.entries(monthlyData).map(([month, mData]) => {
                  const data = mData as { present: number; total: number };
                  return (
                    <div key={month} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-900 dark:text-slate-50">{month}</span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {Math.round((data.present / data.total) * 100)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              (data.present / data.total) * 100 >= attendanceThreshold 
                                ? 'bg-emerald-500' 
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${(data.present / data.total) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 w-20 text-right">
                        {data.present}/{data.total}
                      </div>
                    </div>
                  </div>
                );
                })
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  No attendance data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Attendance */}
        <Card className="border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Recent Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {attendanceData.slice(0, 20).map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${record.present ? 'bg-emerald-50 dark:bg-emerald-950' : 'bg-red-50 dark:bg-red-950'}`}>
                      {record.present ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-50">
                        {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${record.present ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {record.present ? 'Present' : 'Absent'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttendancePage;
