"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Trophy,
  ClipboardCheck,
  Calendar,
  Filter,
  Download,
  BarChart3,
  PieChart,
  LineChart,
  Award,
  AlertTriangle,
  Star,
  Target,
} from "lucide-react";

type AnalyticsData = {
  overview: {
    totalStudents: number;
    averageAttendance: number;
    averageMarks: number;
    homeworkCompletion: number;
  };
  classPerformance: {
    className: string;
    averageMarks: number;
    attendanceRate: number;
    homeworkCompletion: number;
    trend: "up" | "down" | "stable";
  }[];
  topPerformers: {
    studentId: string;
    name: string;
    surname: string;
    className: string;
    averageMarks: number;
    attendanceRate: number;
  }[];
  weakStudents: {
    studentId: string;
    name: string;
    surname: string;
    className: string;
    averageMarks: number;
    attendanceRate: number;
    needsAttention: string[];
  }[];
  subjectPerformance: {
    subjectName: string;
    averageMarks: number;
    highestScore: number;
    lowestScore: number;
    passRate: number;
  }[];
  trends: {
    period: string;
    attendance: number;
    marks: number;
    homework: number;
  }[];
};

export default function AnalyticsPage() {
  const router = useRouter();

  // States
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "term">("month");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/teacher/analytics?period=${selectedPeriod}`);
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        throw new Error("Failed to fetch analytics");
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    // In a real implementation, this would generate a PDF/Excel report
    toast.info("Report export feature coming soon!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Performance Analytics</h1>
          <p className="text-sm text-gray-500">Insights into student and class performance</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="term">This Term</option>
          </select>
          <button
            onClick={exportReport}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="text-2xl font-bold text-gray-800">{analyticsData.overview.totalStudents}</span>
          </div>
          <p className="text-xs text-gray-500">Total Students</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <ClipboardCheck className="w-5 h-5 text-green-500" />
            <span className="text-2xl font-bold text-gray-800">{analyticsData.overview.averageAttendance}%</span>
          </div>
          <p className="text-xs text-gray-500">Avg Attendance</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Trophy className="w-5 h-5 text-purple-500" />
            <span className="text-2xl font-bold text-gray-800">{analyticsData.overview.averageMarks}%</span>
          </div>
          <p className="text-xs text-gray-500">Avg Marks</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="w-5 h-5 text-orange-500" />
            <span className="text-2xl font-bold text-gray-800">{analyticsData.overview.homeworkCompletion}%</span>
          </div>
          <p className="text-xs text-gray-500">Homework Completion</p>
        </div>
      </div>

      {/* Class Performance */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Class Performance
          </h2>
        </div>
        <div className="space-y-4">
          {analyticsData.classPerformance.map((classData) => (
            <div key={classData.className} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">{classData.className}</span>
                <div className="flex items-center gap-2">
                  {classData.trend === "up" && <TrendingUp className="w-4 h-4 text-green-500" />}
                  {classData.trend === "down" && <TrendingDown className="w-4 h-4 text-red-500" />}
                  <span className="text-sm text-gray-500">{classData.averageMarks}% avg</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Marks</span>
                    <span className="font-medium">{classData.averageMarks}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 transition-all"
                      style={{ width: `${classData.averageMarks}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Attendance</span>
                    <span className="font-medium">{classData.attendanceRate}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${classData.attendanceRate}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Homework</span>
                    <span className="font-medium">{classData.homeworkCompletion}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 transition-all"
                      style={{ width: `${classData.homeworkCompletion}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performers & Weak Students */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-yellow-500" />
            <h2 className="font-semibold text-gray-800">Top Performers</h2>
          </div>
          <div className="space-y-3">
            {analyticsData.topPerformers.map((student, index) => (
              <div
                key={student.studentId}
                className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg"
              >
                <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center font-bold text-yellow-700">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    {student.name} {student.surname}
                  </p>
                  <p className="text-xs text-gray-500">{student.className}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{student.averageMarks}%</p>
                  <p className="text-xs text-gray-500">{student.attendanceRate}% attendance</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Students */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="font-semibold text-gray-800">Needs Attention</h2>
          </div>
          <div className="space-y-3">
            {analyticsData.weakStudents.map((student) => (
              <div
                key={student.studentId}
                className="flex items-center gap-3 p-3 bg-red-50 rounded-lg"
              >
                <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    {student.name} {student.surname}
                  </p>
                  <p className="text-xs text-gray-500">{student.className}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {student.needsAttention.map((issue) => (
                      <span
                        key={issue}
                        className="px-2 py-0.5 bg-red-200 text-red-800 text-xs rounded-full"
                      >
                        {issue}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{student.averageMarks}%</p>
                  <p className="text-xs text-gray-500">{student.attendanceRate}% attendance</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject Performance */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="w-5 h-5 text-indigo-500" />
          <h2 className="font-semibold text-gray-800">Subject Performance</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyticsData.subjectPerformance.map((subject) => (
            <div key={subject.subjectName} className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3">{subject.subjectName}</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Average</span>
                  <span className="font-medium">{subject.averageMarks}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Highest</span>
                  <span className="font-medium text-green-600">{subject.highestScore}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Lowest</span>
                  <span className="font-medium text-red-600">{subject.lowestScore}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Pass Rate</span>
                  <span className="font-medium">{subject.passRate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Trends */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <LineChart className="w-5 h-5 text-blue-500" />
          <h2 className="font-semibold text-gray-800">Performance Trends</h2>
        </div>
        <div className="space-y-4">
          {analyticsData.trends.map((trend) => (
            <div key={trend.period} className="flex items-center gap-4">
              <div className="w-24 text-sm text-gray-500">{trend.period}</div>
              <div className="flex-1 grid grid-cols-3 gap-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Attendance</span>
                    <span className="font-medium">{trend.attendance}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${trend.attendance}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Marks</span>
                    <span className="font-medium">{trend.marks}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 transition-all"
                      style={{ width: `${trend.marks}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Homework</span>
                    <span className="font-medium">{trend.homework}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 transition-all"
                      style={{ width: `${trend.homework}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors">
          <Users className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-blue-700">View All Students</span>
        </button>
        <button className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors">
          <ClipboardCheck className="w-5 h-5 text-green-600" />
          <span className="font-medium text-green-700">Attendance Report</span>
        </button>
        <button className="flex items-center gap-2 p-4 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors">
          <Trophy className="w-5 h-5 text-purple-600" />
          <span className="font-medium text-purple-700">Marks Analysis</span>
        </button>
        <button className="flex items-center gap-2 p-4 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 transition-colors">
          <Target className="w-5 h-5 text-orange-600" />
          <span className="font-medium text-orange-700">Set Goals</span>
        </button>
      </div>
    </div>
  );
}
