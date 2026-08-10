import { CheckCircle2, FileText, Calendar, BookOpen, TrendingUp, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: "assignment" | "attendance" | "exam" | "achievement" | "other";
  title: string;
  description: string;
  date: string;
  time?: string;
}

interface ActivityTimelineProps {
  activities: ActivityItem[];
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const typeConfig = {
    assignment: {
      icon: FileText,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    attendance: {
      icon: Calendar,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
    },
    exam: {
      icon: TrendingUp,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    achievement: {
      icon: Award,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950",
    },
    other: {
      icon: CheckCircle2,
      color: "text-slate-600 dark:text-slate-400",
      bgColor: "bg-slate-50 dark:bg-slate-800",
    },
  };

  if (!activities || activities.length === 0) {
    return (
      <Card className="border-slate-200 dark:border-slate-700">
        <CardContent className="p-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-400">No recent activity</p>
        </CardContent>
      </Card>
    );
  }

  // Group activities by date
  const groupedActivities = activities.reduce((acc, activity) => {
    const dateKey = new Date(activity.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(activity);
    return acc;
  }, {} as Record<string, ActivityItem[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedActivities).map(([dateKey, dayActivities]) => (
        <div key={dateKey}>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wide">
              {dateKey}
            </span>
            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
          </div>
          <div className="space-y-3">
            {dayActivities.map((activity, index) => {
              const config = typeConfig[activity.type];
              const Icon = config.icon;

              return (
                <div key={activity.id} className="relative pl-6">
                  {/* Timeline connector */}
                  {index !== dayActivities.length - 1 && (
                    <div className="absolute left-2 top-6 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
                  )}
                  
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                  </div>

                  <Card className="border-slate-200 dark:border-slate-700">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${config.bgColor} mt-0.5`}>
                          <Icon className={`h-4 w-4 ${config.color}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900 dark:text-slate-50 text-sm mb-0.5">
                            {activity.title}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                            {activity.description}
                          </p>
                          {activity.time && (
                            <span className="text-xs text-slate-500 dark:text-slate-500">
                              {activity.time}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
