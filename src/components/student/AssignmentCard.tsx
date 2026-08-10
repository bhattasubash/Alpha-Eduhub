import { Calendar, Clock, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AssignmentCardProps {
  assignment: {
    id: number;
    title: string;
    subject: string;
    teacher: string;
    dueDate: string;
    status: "upcoming" | "pending" | "submitted" | "completed" | "overdue";
    progress?: number;
  };
}

export default function AssignmentCard({ assignment }: AssignmentCardProps) {
  const statusConfig = {
    upcoming: {
      icon: Calendar,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      label: "Upcoming",
    },
    pending: {
      icon: AlertCircle,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950",
      label: "Pending",
    },
    submitted: {
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
      label: "Submitted",
    },
    completed: {
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
      label: "Completed",
    },
    overdue: {
      icon: AlertCircle,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950",
      label: "Overdue",
    },
  };

  const config = statusConfig[assignment.status];
  const Icon = config.icon;

  const isOverdue = new Date(assignment.dueDate) < new Date() && assignment.status !== "completed" && assignment.status !== "submitted";

  return (
    <Card className="border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className={`p-2.5 rounded-lg ${config.bgColor}`}>
            <FileText className={`h-5 w-5 ${config.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 dark:text-slate-50 text-sm mb-1">
                  {assignment.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-medium">{assignment.subject}</span>
                  <span>•</span>
                  <span>{assignment.teacher}</span>
                </div>
              </div>
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap",
                  config.bgColor,
                  config.color
                )}
              >
                <Icon className="h-3 w-3" />
                {isOverdue ? "Overdue" : config.label}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-500">
                <Clock className="h-3 w-3" />
                <span>Due {new Date(assignment.dueDate).toLocaleDateString()}</span>
              </div>
              {assignment.progress !== undefined && (
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 dark:bg-blue-400 rounded-full transition-all duration-300"
                      style={{ width: `${assignment.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {assignment.progress}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
