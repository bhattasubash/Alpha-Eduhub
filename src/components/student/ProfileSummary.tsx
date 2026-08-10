import { TrendingUp, TrendingDown, Award, Calendar, BookOpen, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileSummaryProps {
  attendance: {
    percentage: number;
    present: number;
    absent: number;
    late: number;
    total: number;
    trend?: number;
  };
  academics: {
    overallPercentage: number;
    averageMarks: number;
    grade: string;
    trend?: number;
  };
  assignments: {
    completed: number;
    total: number;
    pending: number;
  };
  rank?: {
    position: number;
    total: number;
  };
}

export default function ProfileSummary({
  attendance,
  academics,
  assignments,
  rank,
}: ProfileSummaryProps) {
  const metrics = [
    {
      label: "Attendance",
      value: `${attendance.percentage}%`,
      sub: `${attendance.present} of ${attendance.total} days`,
      icon: Calendar,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      trend: attendance.trend,
    },
    {
      label: "Academic Performance",
      value: `${academics.overallPercentage}%`,
      sub: `Grade: ${academics.grade}`,
      icon: Award,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      trend: academics.trend,
    },
    {
      label: "Assignments",
      value: `${assignments.completed}/${assignments.total}`,
      sub: assignments.total > 0
        ? `${Math.round((assignments.completed / assignments.total) * 100)}% completed`
        : "No assignments yet",
      icon: BookOpen,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
    },
    ...(rank
      ? [
          {
            label: "Class Rank",
            value: rank.position > 0 ? `#${rank.position}` : "N/A",
            sub: rank.total > 0 ? `of ${rank.total} students` : "No rank data",
            icon: Trophy,
            color: "text-amber-600 dark:text-amber-400",
            bgColor: "bg-amber-50 dark:bg-amber-950",
          },
        ]
      : []),
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const hasPositiveTrend = metric.trend && metric.trend > 0;
        const hasNegativeTrend = metric.trend && metric.trend < 0;

        return (
          <Card
            key={index}
            className="border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                </div>
                {hasPositiveTrend && (
                  <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="h-3 w-3" />
                    <span>+{metric.trend}%</span>
                  </div>
                )}
                {hasNegativeTrend && (
                  <div className="flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
                    <TrendingDown className="h-3 w-3" />
                    <span>{metric.trend}%</span>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                  {metric.value}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {metric.label}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500">
                  {metric.sub}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
