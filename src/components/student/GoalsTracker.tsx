import { Target, Plus, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Goal {
  id: string;
  type: string;
  title: string;
  targetValue: number;
  currentValue: number;
  unit?: string;
  status: "ACTIVE" | "ACHIEVED" | "MISSED" | "CANCELLED";
  deadline?: string;
}

interface GoalsTrackerProps {
  goals: Goal[];
  onAddGoal?: () => void;
}

export default function GoalsTracker({ goals, onAddGoal }: GoalsTrackerProps) {
  const statusConfig = {
    ACTIVE: {
      icon: Clock,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      label: "Active",
    },
    ACHIEVED: {
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
      label: "Achieved",
    },
    MISSED: {
      icon: XCircle,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950",
      label: "Missed",
    },
    CANCELLED: {
      icon: XCircle,
      color: "text-slate-600 dark:text-slate-400",
      bgColor: "bg-slate-50 dark:bg-slate-800",
      label: "Cancelled",
    },
  };

  const activeGoals = goals.filter((g) => g.status === "ACTIVE");
  const completedGoals = goals.filter((g) => g.status === "ACHIEVED");

  const calculateProgress = (current: number, target: number) => {
    if (target === 0) return 0;
    return Math.min(100, Math.round((current / target) * 100));
  };

  if (!goals || goals.length === 0) {
    return (
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            My Goals
          </CardTitle>
          <Button size="sm" onClick={onAddGoal} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Goal
          </Button>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <Target className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-400">No goals set yet</p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
            Set academic and attendance goals to track your progress
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          My Goals
        </CardTitle>
        <Button size="sm" onClick={onAddGoal} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Goal
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Active Goals */}
        {activeGoals.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Active Goals</h4>
            <div className="space-y-3">
              {activeGoals.map((goal) => {
                const progress = calculateProgress(goal.currentValue, goal.targetValue);
                const config = statusConfig[goal.status];
                const Icon = config.icon;

                return (
                  <div key={goal.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900 dark:text-slate-50">{goal.title}</h4>
                        {goal.deadline && (
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                            Deadline: {new Date(goal.deadline).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className={`p-1.5 rounded-lg ${config.bgColor}`}>
                        <Icon className={`h-4 w-4 ${config.color}`} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">
                          {goal.currentValue} / {goal.targetValue} {goal.unit}
                        </span>
                        <span className="font-medium text-slate-900 dark:text-slate-50">{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            progress >= 100 ? 'bg-emerald-500' :
                            progress >= 75 ? 'bg-blue-500' :
                            progress >= 50 ? 'bg-amber-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Completed Goals</h4>
            <div className="space-y-2">
              {completedGoals.map((goal) => {
                const config = statusConfig[goal.status];
                const Icon = config.icon;

                return (
                  <div key={goal.id} className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
                    <div className={`p-1.5 rounded-lg ${config.bgColor}`}>
                      <Icon className={`h-4 w-4 ${config.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-emerald-900 dark:text-emerald-100">{goal.title}</h4>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300">
                        Achieved: {goal.currentValue} / {goal.targetValue} {goal.unit}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
