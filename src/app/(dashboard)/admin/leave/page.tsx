"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle2, XCircle, Clock, Filter, Calendar, ArrowLeft, Users, GraduationCap } from "lucide-react";
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
  student?: {
    id: string;
    name: string;
    surname: string;
    admissionNumber?: string;
    rollNumber?: string;
    class: {
      name: string;
    };
    grade: {
      level: number;
    };
  };
  teacher?: {
    id: string;
    name: string;
    surname: string;
    designation?: string;
  };
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  reviewComment?: string | null;
}

interface SectionInfo {
  classId: number;
  className: string;
  gradeLevel: number;
  section: string | null;
  studentCount: number;
  pendingLeaves: number;
}

export default function AdminLeavePage() {
  const [view, setView] = useState<string>("sections");
  const [sections, setSections] = useState<SectionInfo[]>([]);
  const [selectedSection, setSelectedSection] = useState<SectionInfo | null>(null);
  const [studentLeaveRequests, setStudentLeaveRequests] = useState<LeaveRequest[]>([]);
  const [allLeaveRequests, setAllLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchSections = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/leave/sections");
      if (response.ok) {
        const data = await response.json();
        setSections(data);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStudentLeaveRequests = useCallback(async (section: SectionInfo) => {
    try {
      setLoading(true);
      const url = `/api/admin/leave/section?classId=${section.classId}&section=${section.section || ""}&status=${filter}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setStudentLeaveRequests(data);
      }
    } catch (error) {
      console.error("Error fetching student leave requests:", error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const fetchAllLeaveRequests = useCallback(async () => {
    try {
      setLoading(true);
      const url = typeFilter === "ALL" 
        ? `/api/admin/leave?status=${filter}`
        : `/api/admin/leave?status=${filter}&type=${typeFilter}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setAllLeaveRequests(data);
      }
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    } finally {
      setLoading(false);
    }
  }, [filter, typeFilter]);

  useEffect(() => {
    if ((view as string) === "sections") {
      fetchSections();
    } else if ((view as string) === "students" && selectedSection) {
      fetchStudentLeaveRequests(selectedSection);
    } else if ((view as string) === "all") {
      fetchAllLeaveRequests();
    }
  }, [view, filter, typeFilter, selectedSection, fetchSections, fetchStudentLeaveRequests, fetchAllLeaveRequests]);

  const handleApprove = async (leaveId: string) => {
    setProcessing(leaveId);
    try {
      const response = await fetch(`/api/admin/leave/${leaveId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "APPROVE" }),
      });

      if (response.ok) {
        if ((view as string) === "students" && selectedSection) {
          await fetchStudentLeaveRequests(selectedSection);
        } else if ((view as string) === "all") {
          await fetchAllLeaveRequests();
        } else {
          await fetchSections();
        }
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
      const response = await fetch(`/api/admin/leave/${leaveId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "REJECT", comment }),
      });

      if (response.ok) {
        if ((view as string) === "students" && selectedSection) {
          await fetchStudentLeaveRequests(selectedSection);
        } else if ((view as string) === "all") {
          await fetchAllLeaveRequests();
        } else {
          await fetchSections();
        }
      } else {
        throw new Error("Failed to reject leave request");
      }
    } catch (error) {
      console.error("Error rejecting leave:", error);
    } finally {
      setProcessing(null);
    }
  };

  const handleSectionClick = (section: SectionInfo) => {
    setSelectedSection(section);
    setView("students" as string);
  };

  const handleBackToSections = () => {
    setSelectedSection(null);
    setView("sections" as string);
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

  // SECTIONS VIEW
  if ((view as string) === "sections") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-50">Leave Management</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">Select a section to manage student leave requests</p>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setView("sections" as string)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              (view as string) === "sections"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <GraduationCap className="inline w-4 h-4 mr-2" />
            By Section
          </button>
          <button
            onClick={() => setView("all" as string)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              (view as string) === "all"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Users className="inline w-4 h-4 mr-2" />
            All Requests
          </button>
        </div>

        <Card className="border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Sections with Pending Leave Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sections.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                No sections with pending leave requests
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sections.map((section) => (
                  <div
                    key={`${section.classId}-${section.section}`}
                    onClick={() => handleSectionClick(section)}
                    className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:shadow-md transition-shadow cursor-pointer border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-slate-900 dark:text-slate-50">
                          Grade {section.gradeLevel} - {section.className}
                          {section.section && ` (${section.section})`}
                        </h3>
                      </div>
                      {section.pendingLeaves > 0 && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                          {section.pendingLeaves} pending
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{section.studentCount} students</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // STUDENTS VIEW (within a section)
  if ((view as string) === "students" && selectedSection) {
    const currentRequests = filter === "ALL" 
      ? studentLeaveRequests 
      : studentLeaveRequests.filter(req => req.status === filter);

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToSections}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sections
          </button>
          <div className="h-6 w-px bg-slate-300 dark:bg-slate-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-50">
              Grade {selectedSection.gradeLevel} - {selectedSection.className}
              {selectedSection.section && ` (${selectedSection.section})`}
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Student Leave Requests
            </p>
          </div>
        </div>

        <Card className="border-slate-200 dark:border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                Leave Requests
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
            {currentRequests.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                No leave requests found in this section
              </div>
            ) : (
              <div className="space-y-3">
                {currentRequests.map((leave) => {
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
                                {leave.student?.name} {leave.student?.surname}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                  Student
                                </span>
                                {leave.student?.rollNumber && (
                                  <span>Roll No: {leave.student.rollNumber}</span>
                                )}
                                {leave.student?.admissionNumber && (
                                  <span>Adm No: {leave.student.admissionNumber}</span>
                                )}
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
                              <Calendar className="inline w-4 h-4 mr-1" />
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

                        {leave.status === "PENDING" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(leave.id)}
                              disabled={isProcessing}
                              className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 text-sm font-medium"
                            >
                              {isProcessing ? "..." : "Approve"}
                            </button>
                            <button
                              onClick={() => handleReject(leave.id)}
                              disabled={isProcessing}
                              className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
                            >
                              {isProcessing ? "..." : "Reject"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ALL REQUESTS VIEW
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-50">Leave Management</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400">Approve all student and teacher leave requests</p>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setView("sections" as string)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            (view as string) === "sections" 
              ? "bg-blue-600 text-white" 
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <GraduationCap className="inline w-4 h-4 mr-2" />
          By Section
        </button>
        <button
          onClick={() => setView("all" as string)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            (view as string) === "all" 
              ? "bg-blue-600 text-white" 
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Users className="inline w-4 h-4 mr-2" />
          All Requests (Students + Teachers)
        </button>
      </div>

      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              All Leave Requests
            </CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm"
              >
                <option value="ALL">All Types</option>
                <option value="STUDENT">Student Leave</option>
                <option value="TEACHER">Teacher Leave</option>
              </select>
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
          {allLeaveRequests.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              No leave requests found
            </div>
          ) : (
            <div className="space-y-3">
              {allLeaveRequests.map((leave) => {
                const config = statusConfig[leave.status];
                const Icon = config.icon;
                const isProcessing = processing === leave.id;
                const isStudentLeave = !!leave.student;
                const requesterName = isStudentLeave 
                  ? `${leave.student?.name} ${leave.student?.surname}`
                  : `${leave.teacher?.name} ${leave.teacher?.surname}`;
                const requesterInfo = isStudentLeave
                  ? `Grade ${leave.student?.grade.level} - ${leave.student?.class.name}`
                  : leave.teacher?.designation || "Teacher";

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
                              {requesterName}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                {isStudentLeave ? "Student" : "Teacher"}
                              </span>
                              <span>{requesterInfo}</span>
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
                            <Calendar className="inline w-4 h-4 mr-1" />
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

                      {leave.status === "PENDING" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(leave.id)}
                            disabled={isProcessing}
                            className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 text-sm font-medium"
                          >
                            {isProcessing ? "..." : "Approve"}
                          </button>
                          <button
                            onClick={() => handleReject(leave.id)}
                            disabled={isProcessing}
                            className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
                          >
                            {isProcessing ? "..." : "Reject"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
