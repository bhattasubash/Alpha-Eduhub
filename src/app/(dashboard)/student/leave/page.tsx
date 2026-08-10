"use client";

import { useState, useEffect } from "react";
import { Send, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LeaveHistory from "@/components/student/LeaveHistory";
import ApplyLeaveModal, { LeaveFormData } from "@/components/student/ApplyLeaveModal";
import ProfileNavigation from "@/components/student/ProfileNavigation";

export default function LeavePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const response = await fetch("/api/student/leave");
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

  const handleSubmitLeave = async (data: LeaveFormData) => {
    try {
      const response = await fetch("/api/student/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchLeaveRequests();
        setError(null);
      } else {
        const error = await response.json();
        setError(error.error || "Failed to submit leave request");
        throw new Error(error.error || "Failed to submit leave request");
      }
    } catch (error) {
      console.error("Error submitting leave:", error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <ProfileNavigation />
      
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Leave Management</h1>
            <p className="text-slate-600 dark:text-slate-400">Apply for leave and view your leave history</p>
          </div>
          <Button onClick={() => { setIsModalOpen(true); setError(null); }} className="gap-2">
            <Send className="h-4 w-4" />
            Apply for Leave
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <Card className="border-slate-200 dark:border-slate-700">
            <CardContent className="p-8 text-center">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mx-auto" />
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <LeaveHistory leaveRequests={leaveRequests} />
        )}
      </div>

      <ApplyLeaveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitLeave}
      />
    </div>
  );
}
