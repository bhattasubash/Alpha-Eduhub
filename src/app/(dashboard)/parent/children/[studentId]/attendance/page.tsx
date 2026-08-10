"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface AttendanceData {
  overall: {
    percentage: number;
    present: number;
    absent: number;
    total: number;
    threshold: number;
    isBelowThreshold: boolean;
  };
  monthlyBreakdown: Array<{
    month: string;
    present: number;
    absent: number;
    total: number;
    percentage: number;
  }>;
  history: any[];
}

export default function AttendancePage({
  params,
}: {
  params: { studentId: string };
}) {
  const [data, setData] = useState<AttendanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  useEffect(() => {
    fetchAttendanceData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.studentId, selectedMonth]);

  const fetchAttendanceData = async () => {
    try {
      const url = selectedMonth
        ? `/api/parent/children/${params.studentId}/attendance?month=${selectedMonth}`
        : `/api/parent/children/${params.studentId}/attendance`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setData(data);
      }
    } catch (err) {
      console.error("Error fetching attendance:", err);
    } finally {
      setLoading(false);
    }
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

  if (!data) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Failed to load attendance data
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
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="text-gray-600">View attendance records and history</p>
      </div>

      {/* Overall Stats */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Overall Attendance</h2>
          {data.overall.isBelowThreshold && (
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm">
              <AlertTriangle className="w-4 h-4" />
              Below threshold ({data.overall.threshold}%)
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Attendance Rate</p>
            <p className="text-3xl font-bold text-gray-900">{data.overall.percentage}%</p>
            <p className="text-sm text-gray-600 mt-2">
              {data.overall.present} present out of {data.overall.total} days
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Present Days</p>
            <p className="text-3xl font-bold text-gray-900">{data.overall.present}</p>
            <p className="text-sm text-gray-600 mt-2">Days attended</p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Absent Days</p>
            <p className="text-3xl font-bold text-gray-900">{data.overall.absent}</p>
            <p className="text-sm text-gray-600 mt-2">Days missed</p>
          </div>
        </div>
      </div>

      {/* Month Filter */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Monthly Breakdown</h2>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">All Time</option>
            {data.monthlyBreakdown.map((mb) => (
              <option key={mb.month} value={mb.month}>
                {mb.month}
              </option>
            ))}
          </select>
        </div>

        {data.monthlyBreakdown.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No monthly data available</p>
        ) : (
          <div className="space-y-3">
            {data.monthlyBreakdown.map((mb) => (
              <div
                key={mb.month}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{mb.month}</h3>
                  <span
                    className={`font-semibold ${
                      mb.percentage >= data.overall.threshold
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {mb.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      mb.percentage >= data.overall.threshold
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                    style={{ width: `${mb.percentage}%` }}
                  />
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{mb.present} present</span>
                  <span>{mb.absent} absent</span>
                  <span>{mb.total} total</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent History */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Attendance</h2>
        {data.history.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No attendance history available</p>
        ) : (
          <div className="space-y-2">
            {data.history.slice(0, 20).map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(record.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {record.lesson?.subject?.name || "Class"}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    record.present
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {record.present ? "Present" : "Absent"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
