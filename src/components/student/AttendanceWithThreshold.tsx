import { AlertTriangle, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AttendanceRingChart from "@/components/student/AttendanceRingChart";

interface AttendanceWithThresholdProps {
  percentage: number;
  present: number;
  absent: number;
  total: number;
  threshold: number;
  upcomingClasses?: number;
}

export default function AttendanceWithThreshold({
  percentage,
  present,
  absent,
  total,
  threshold,
  upcomingClasses = 0,
}: AttendanceWithThresholdProps) {
  const isBelowThreshold = percentage < threshold;
  const diffFromThreshold = threshold - percentage;
  
  // Calculate how many more classes needed to reach threshold
  const neededToReachThreshold = isBelowThreshold
    ? Math.ceil((threshold * (total + upcomingClasses) - (present * 100)) / 100)
    : 0;

  const canReachThreshold = neededToReachThreshold <= upcomingClasses;

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          Attendance Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Ring Chart */}
        <div className="flex justify-center">
          <AttendanceRingChart percentage={percentage} size={180} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">{present}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Present</div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="text-lg font-semibold text-red-600 dark:text-red-400">{absent}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Absent</div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="text-lg font-semibold text-slate-900 dark:text-slate-50">{total}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Total</div>
          </div>
        </div>

        {/* Threshold Warning */}
        {isBelowThreshold && (
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-1">
                  Attendance Below Threshold
                </h4>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Your attendance ({percentage}%) is {diffFromThreshold.toFixed(1)}% below the required threshold ({threshold}%).
                </p>
                {canReachThreshold && neededToReachThreshold > 0 && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                    <Calendar className="h-4 w-4" />
                    <span>
                      You need to attend {neededToReachThreshold} more {neededToReachThreshold === 1 ? 'class' : 'classes'} to reach the threshold.
                    </span>
                  </div>
                )}
                {!canReachThreshold && (
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    You cannot reach the threshold with the remaining {upcomingClasses} classes.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Good Standing */}
        {!isBelowThreshold && (
          <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <h4 className="font-medium text-emerald-900 dark:text-emerald-100">
                  Good Standing
                </h4>
                <p className="text-sm text-emerald-800 dark:text-emerald-200">
                  Your attendance is {percentage - threshold}% above the required threshold.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
