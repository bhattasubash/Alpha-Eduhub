import { Trophy, Star, Award, Target, BookOpen, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  achievedAt: string;
  metadata?: any;
}

interface AchievementSystemProps {
  achievements: Achievement[];
}

export default function AchievementSystem({ achievements }: AchievementSystemProps) {
  const achievementConfig: Record<string, { icon: any; color: string; bgColor: string }> = {
    ATTENDANCE_PERFECT: {
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
    },
    ATTENDANCE_STREAK: {
      icon: Trophy,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950",
    },
    PERFORMANCE_IMPROVED: {
      icon: TrendingUp,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    PERSONAL_BEST: {
      icon: Award,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    ASSIGNMENT_CHAMPION: {
      icon: Star,
      color: "text-pink-600 dark:text-pink-400",
      bgColor: "bg-pink-50 dark:bg-pink-950",
    },
    EXAM_EXCELLENCE: {
      icon: Award,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-950",
    },
    SUBJECT_MASTER: {
      icon: BookOpen,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-950",
    },
    EARLY_SUBMITTER: {
      icon: Clock,
      color: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-50 dark:bg-teal-950",
    },
    CONSISTENT_PERFORMER: {
      icon: Target,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
  };



  if (!achievements || achievements.length === 0) {
    return (
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <Trophy className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-400">No achievements yet</p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
            Keep working hard to earn achievements!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {achievements.map((achievement) => {
            const config = achievementConfig[achievement.type] || {
              icon: Star,
              color: "text-slate-600 dark:text-slate-400",
              bgColor: "bg-slate-50 dark:bg-slate-800",
            };
            const Icon = config.icon;

            return (
              <div
                key={achievement.id}
                className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${config.bgColor}`}>
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 dark:text-slate-50 text-sm">
                      {achievement.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                      {achievement.description}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                      {new Date(achievement.achievedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
