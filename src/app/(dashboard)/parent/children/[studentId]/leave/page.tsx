"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

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
  reviewedBy?: string | null;
  reviewComment?: string | null;
  student: {
    name: string;
    surname: string;
    class: {
      name: string;
    };
    grade: {
      level: number;
    };
  };
}

export default function LeavePage({
  params,
}: {
  params: { studentId: string };
}) {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchLeaveRequests();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.studentId, filter]);

  const fetchLeaveRequests = async () => {
    try {
      const url = filter === "all"
        ? `/api/parent/children/${params.studentId}/leave`
        : `/api/parent/children/${params.studentId}/leave?status=${filter}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setLeaveRequests(data);
      }
    } catch (err) {
      console.error("Error fetching leave requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          icon: Clock,
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          label: "Pending",
        };
      case "APPROVED":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50",
          label: "Approved",
        };
      case "REJECTED":
        return {
          icon: XCircle,
          color: "text-red-600",
          bgColor: "bg-red-50",
          label: "Rejected",
        };
      case "CANCELLED":
        return {
          icon: XCircle,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          label: "Cancelled",
        };
      default:
        return {
          icon: AlertCircle,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          label: status,
        };
    }
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
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/parent"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Leave Requests</h1>
        <p className="text-gray-600">View leave request history and status</p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          {["all", "PENDING", "APPROVED", "REJECTED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Leave Requests */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {filter === "all" ? "All Leave Requests" : `${filter.charAt(0) + filter.slice(1).toLowerCase()} Requests`}
        </h2>
        {leaveRequests.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No leave requests found</p>
        ) : (
          <div className="space-y-4">
            {leaveRequests.map((leave) => {
              const config = getStatusConfig(leave.status);
              const Icon = config.icon;

              return (
                <div
                  key={leave.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${config.bgColor}`}>
                          <Icon className={`w-4 h-4 ${config.color}`} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {leave.student.name} {leave.student.surname}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span>Grade {leave.student.grade.level}</span>
                            <span>•</span>
                            <span>{leave.student.class.name}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600 mt-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{leaveTypeLabels[leave.type] || leave.type}</span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bgColor} ${config.color}`}>
                            {config.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                          </span>
                          <span className="text-gray-500">({leave.numberOfDays} days)</span>
                        </div>
                        <p className="line-clamp-2">{leave.reason}</p>
                        {leave.reviewComment && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                            <span className="font-medium">Response: </span>
                            {leave.reviewComment}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                    <span>Applied: {new Date(leave.appliedAt).toLocaleDateString()}</span>
                    {leave.reviewedAt && (
                      <span>Reviewed: {new Date(leave.reviewedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
