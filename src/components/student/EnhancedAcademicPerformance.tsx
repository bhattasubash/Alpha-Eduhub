import { TrendingUp, TrendingDown, Award, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AcademicPerformanceChart from "@/components/student/AcademicPerformanceChart";

interface SubjectPerformance {
  subject: string;
  percentage: number;
  average: number;
  grade: string;
}

interface ExamResult {
  id: number;
  title: string;
  date: string;
  percentage: number;
  grade: string;
  marks: number;
  maxMarks: number;
}

interface EnhancedAcademicPerformanceProps {
  overallPercentage: number;
  averageMarks: number;
  grade: string;
  classPosition?: number;
  totalStudents?: number;
  subjectPerformance: SubjectPerformance[];
  performanceData: { date: string; examName: string; percentage: number }[];
  examResults: ExamResult[];
  personalBest?: { percentage: number; exam: string; date: string };
}

export default function EnhancedAcademicPerformance({
  overallPercentage,
  averageMarks,
  grade,
  classPosition,
  totalStudents,
  subjectPerformance,
  performanceData,
  examResults,
  personalBest,
}: EnhancedAcademicPerformanceProps) {
  // Identify best and worst performing subjects
  const sortedSubjects = [...subjectPerformance].sort((a, b) => b.percentage - a.percentage);
  const bestSubject = sortedSubjects[0];
  const worstSubject = sortedSubjects[sortedSubjects.length - 1];

  // Calculate improvement from previous exam (if data available)
  const hasPreviousData = performanceData.length >= 2;
  const previousPercentage = hasPreviousData ? performanceData[performanceData.length - 2].percentage : null;
  const improvement = hasPreviousData && previousPercentage !== null
    ? overallPercentage - previousPercentage
    : null;

  return (
    <div className="space-y-6">
      {/* Overall Performance */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Academic Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">{overallPercentage}%</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Overall</div>
            </div>
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">{averageMarks}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Avg. Marks</div>
            </div>
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">{grade}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Grade</div>
            </div>
            {classPosition && totalStudents && (
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">#{classPosition}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">of {totalStudents}</div>
              </div>
            )}
          </div>

          {/* Improvement Indicator */}
          {improvement !== null && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              improvement > 0 
                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' 
                : improvement < 0
                ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              {improvement > 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : improvement < 0 ? (
                <TrendingDown className="h-4 w-4" />
              ) : null}
              <span className="text-sm font-medium">
                {improvement > 0 ? `Improved by ${improvement.toFixed(1)}%` : 
                 improvement < 0 ? `Declined by ${Math.abs(improvement).toFixed(1)}%` : 
                 'No change from previous exam'}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Chart */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Performance Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AcademicPerformanceChart data={performanceData} />
        </CardContent>
      </Card>

      {/* Subject-wise Performance */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Subject-wise Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectPerformance.map((subject) => (
              <div key={subject.subject} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-slate-500" />
                    <span className="font-medium text-slate-900 dark:text-slate-50">{subject.subject}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{subject.grade}</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-50">{subject.percentage}%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      subject.percentage >= 90 ? 'bg-emerald-500' :
                      subject.percentage >= 75 ? 'bg-blue-500' :
                      subject.percentage >= 60 ? 'bg-amber-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${subject.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Best and Worst Subjects */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            {bestSubject && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Best Subject</span>
                </div>
                <div className="font-semibold text-emerald-900 dark:text-emerald-100">{bestSubject.subject}</div>
                <div className="text-sm text-emerald-700 dark:text-emerald-300">{bestSubject.percentage}%</div>
              </div>
            )}
            {worstSubject && worstSubject.percentage < 80 && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm font-medium text-amber-900 dark:text-amber-100">Needs Improvement</span>
                </div>
                <div className="font-semibold text-amber-900 dark:text-amber-100">{worstSubject.subject}</div>
                <div className="text-sm text-amber-700 dark:text-amber-300">{worstSubject.percentage}%</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Personal Best */}
      {personalBest && (
        <Card className="border-slate-200 dark:border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 dark:bg-amber-950 rounded-lg">
                <Award className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-900 dark:text-slate-50">Personal Best</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {personalBest.percentage}% in {personalBest.exam} on {new Date(personalBest.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
