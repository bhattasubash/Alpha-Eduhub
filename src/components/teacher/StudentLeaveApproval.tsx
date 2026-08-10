"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Clock, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  student: {
    id: string;
    name: string;
    surname: string;
    admissionNumber?: string;
    class: {
      name: string;
    };
    grade: {
      level: number;
    };
  };
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  reviewComment?: string | null;
}

export default function StudentLeaveApproval() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaveRequests();
  }, [filter]);

  const fetchLeaveRequests = async () => {
    try {
      const url = filter === "ALL" 
        ? "/api/teacher/student-leave"
        : `/api/teacher/student-leave?status=${filter}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setLeaveRequests(data);
      }
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (leaveId: string) => {
    setProcessing(leaveId);
    try {
      const response = await fetch(`/api/student/leave/${leaveId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "APPROVE" }),
      });

      if (response.ok) {
        await fetchLeaveRequests();
      } else {
        throw new Error("Failed to approve leave request");
      }
    } catch (error) {
      console.error("Error approving leave:", error);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (leaveId: string, comment?: string) => {
    setProcessing(leaveId);
    try {
      const response = await fetch(`/api/student/leave/${leaveId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "REJECT", comment }),
      });

      if (response.ok) {
        await fetchLeaveRequests();
      } else {
        throw new Error("Failed to reject leave request");
      }
    } catch (error) {
      console.error("Error rejecting leave:", error);
    } finally {
      setProcessing(null);
    }
  };

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
      icon: XCircle,
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

  if (loading) {
    return (
      <Card className="border-slate-200 dark:border-slate-700">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mx-auto" />
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Student Leave Requests
          </CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {leaveRequests.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            No leave requests found
          </div>
        ) : (
          <div className="space-y-3">
            {leaveRequests.map((leave) => {
              const config = statusConfig[leave.status];
              const Icon = config.icon;
              const isProcessing = processing === leave.id;

              return (
                <div
                  key={leave.id}
                  className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${config.bgColor}`}>
                          <Icon className={`h-4 w-4 ${config.color}`} />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-slate-50">
                            {leave.student.name} {leave.student.surname}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                            <span>{leave.student.admissionNumber || leave.student.id}</span>
                            <span>•</span>
                            <span>Grade {leave.student.grade.level}</span>
                            <span>•</span>
                            <span>{leave.student.class.name}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{leaveTypeLabels[leave.type] || leave.type}</span>
                          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", config.bgColor, config.color)}>
                            {config.label}
                          </span>
                        </div>
                        <div>
                          {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                          <span className="text-slate-500 ml-2">({leave.numberOfDays} days)</span>
                        </div>
                        <p className="line-clamp-2">{leave.reason}</p>
                        {leave.reviewComment && (
                          <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-700 rounded text-xs">
                            <span className="font-medium">Response: </span>
                            {leave.reviewComment}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xs text-slate-500 dark:text-slate-500 mb-2">
                        Applied: {new Date(leave.appliedAt).toLocaleDateString()}
                      </div>
                      {leave.status === "PENDING" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(leave.id)}
                            disabled={isProcessing}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            {isProcessing ? "Processing..." : "Approve"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(leave.id)}
                            disabled={isProcessing}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            {isProcessing ? "Processing..." : "Reject"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
