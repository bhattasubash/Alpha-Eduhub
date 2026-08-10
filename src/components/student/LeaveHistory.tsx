import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  appliedAt: string;
  reviewedAt?: string | null;
  reviewComment?: string | null;
}

interface LeaveHistoryProps {
  leaveRequests: LeaveRequest[];
}

export default function LeaveHistory({ leaveRequests }: LeaveHistoryProps) {
  const statusConfig = {
    PENDING: {
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950",
      label: "Pending",
    },
    APPROVED: {
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
      label: "Approved",
    },
    REJECTED: {
      icon: XCircle,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950",
      label: "Rejected",
    },
    CANCELLED: {
      icon: AlertCircle,
      color: "text-slate-600 dark:text-slate-400",
      bgColor: "bg-slate-50 dark:bg-slate-800",
      label: "Cancelled",
    },
  };

  const leaveTypeLabels: Record<string, string> = {
    SICK: "Sick Leave",
    CASUAL: "Casual Leave",
    EMERGENCY: "Emergency Leave",
    MEDICAL: "Medical Leave",
    PERSONAL: "Personal Leave",
    OTHER: "Other",
  };

  if (!leaveRequests || leaveRequests.length === 0) {
    return (
      <Card className="border-slate-200 dark:border-slate-700">
        <CardContent className="p-8 text-center">
          <Calendar className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-400">No leave history yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {leaveRequests.map((leave) => {
        const config = statusConfig[leave.status];
        const Icon = config.icon;

        return (
          <Card key={leave.id} className="border-slate-200 dark:border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-2 rounded-lg ${config.bgColor}`}>
                      <Icon className={`h-4 w-4 ${config.color}`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-50">
                        {leaveTypeLabels[leave.type] || leave.type}
                      </h4>
                      <span className={cn("text-xs font-medium", config.color)}>
                        {config.label}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                      </span>
                      <span className="text-slate-500">({leave.numberOfDays} days)</span>
                    </div>
                    <p className="line-clamp-2">{leave.reason}</p>
                    {leave.reviewComment && (
                      <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-800 rounded text-xs">
                        <span className="font-medium">Response: </span>
                        {leave.reviewComment}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right text-xs text-slate-500 dark:text-slate-500">
                  <div>Applied: {new Date(leave.appliedAt).toLocaleDateString()}</div>
                  {leave.reviewedAt && (
                    <div>Reviewed: {new Date(leave.reviewedAt).toLocaleDateString()}</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
