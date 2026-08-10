"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Calendar, Clock, Plus, X, AlertCircle, CheckCircle2 } from "lucide-react";

type LeaveBalance = {
  casual: number;
  sick: number;
  earned: number;
  total: number;
};

type LeaveRequest = {
  id: string;
  type: "CASUAL" | "SICK" | "EARNED";
  startDate: string;
  endDate: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  appliedAt: string;
  approvedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
};

export default function MyLeavePage() {
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance>({
    casual: 10,
    sick: 5,
    earned: 15,
    total: 30,
  });
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "CASUAL" as "CASUAL" | "SICK" | "EARNED",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchLeaveData();
  }, []);

  const fetchLeaveData = async () => {
    try {
      const [balanceRes, requestsRes] = await Promise.all([
        fetch("/api/teacher/leave/balance"),
        fetch("/api/teacher/leave"),
      ]);

      if (balanceRes.ok) {
        const balance = await balanceRes.json();
        setLeaveBalance(balance);
      }

      if (requestsRes.ok) {
        const requests = await requestsRes.json();
        setLeaveRequests(requests);
      }
    } catch (error) {
      console.error("Failed to fetch leave data:", error);
      toast.error("Failed to load leave data");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.startDate || !formData.endDate || !formData.reason.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error("End date must be after start date");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/teacher/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formData.type,
          startDate: formData.startDate,
          endDate: formData.endDate,
          reason: formData.reason,
          attachmentUrl: null,
        }),
      });

      if (response.ok) {
        toast.success("Leave request submitted successfully! Students have been notified.");
        setFormData({ type: "CASUAL", startDate: "", endDate: "", reason: "" });
        setShowApplyForm(false);
        fetchLeaveData();
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit leave request");
      }
    } catch (error) {
      console.error("Error submitting leave request:", error);
      toast.error("Failed to submit leave request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateLeaveDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case "CASUAL": return "bg-blue-100 text-blue-700";
      case "SICK": return "bg-red-100 text-red-700";
      case "EARNED": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-700";
      case "APPROVED": return "bg-green-100 text-green-700";
      case "REJECTED": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Leave</h1>
          <p className="text-sm text-gray-500">Apply for and manage your leave requests</p>
        </div>
        <button
          onClick={() => setShowApplyForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Apply for Leave</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span className="text-2xl font-bold text-gray-800">{leaveBalance.casual}</span>
          </div>
          <p className="text-xs text-gray-500">Casual Leave</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-2xl font-bold text-gray-800">{leaveBalance.sick}</span>
          </div>
          <p className="text-xs text-gray-500">Sick Leave</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-2xl font-bold text-gray-800">{leaveBalance.earned}</span>
          </div>
          <p className="text-xs text-gray-500">Earned Leave</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-purple-500" />
            <span className="text-2xl font-bold text-gray-800">{leaveBalance.total}</span>
          </div>
          <p className="text-xs text-gray-500">Total Balance</p>
        </div>
      </div>

      {showApplyForm && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Apply for Leave</h2>
            <button
              onClick={() => {
                setShowApplyForm(false);
                setFormData({ type: "CASUAL", startDate: "", endDate: "", reason: "" });
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="CASUAL">Casual Leave</option>
                <option value="SICK">Sick Leave</option>
                <option value="EARNED">Earned Leave</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            {calculateLeaveDays() > 0 && (
              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
                Total leave days: <span className="font-bold">{calculateLeaveDays()}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                placeholder="Please provide reason for leave..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowApplyForm(false);
                  setFormData({ type: "CASUAL", startDate: "", endDate: "", reason: "" });
                }}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">My Leave Requests</h2>
        {leaveRequests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getLeaveTypeColor(request.type)}`}
                  >
                    {request.type}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}
                  >
                    {request.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Applied: {new Date(request.appliedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{request.reason}</p>
                
                {request.status === "APPROVED" && request.approvedBy && (
                  <div className="mt-2 text-sm text-green-600">
                    Approved by {request.approvedBy} on {request.reviewedAt ? new Date(request.reviewedAt).toLocaleDateString() : 'N/A'}
                  </div>
                )}
                
                {request.status === "REJECTED" && request.rejectionReason && (
                  <div className="mt-2 text-sm text-red-600">
                    Rejection reason: {request.rejectionReason}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {leaveRequests.length === 0 && (
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No leave requests found</p>
          </div>
        )}
      </div>
    </div>
  );
}
