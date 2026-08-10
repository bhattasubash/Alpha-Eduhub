"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Trophy,
  ClipboardCheck,
  AlertTriangle,
  FileText,
  TrendingUp,
  TrendingDown,
  Award,
  MessageSquare,
  ArrowLeft,
  CheckCircle2,
  Download,
  UserCheck,
  HeartPulse,
  DollarSign,
  School,
  GraduationCap,
} from "lucide-react";

type StudentProfile = {
  id: string;
  name: string;
  surname: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  className: string;
  rollNumber?: string;
  address?: string;
};

type AttendanceRecord = {
  date: string;
  status: string;
  percentage: number;
};

type MarkRecord = {
  subject: string;
  exam: string;
  score: number;
  maxMarks: number;
  grade: string;
  percentage: number;
};

type BehaviorRecord = {
  date: string;
  type: string;
  description: string;
};

type HomeworkRecord = {
  title: string;
  subject: string;
  dueDate: string;
  status: "completed" | "pending" | "overdue";
  score?: number;
};

type ParentInfo = {
  name: string;
  relation: string;
  phone: string;
  email?: string;
};

type MedicalInfo = {
  condition: string;
  notes: string;
  emergencyContact: string;
};

export default function StudentProfilePage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;

  // States
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [marks, setMarks] = useState<MarkRecord[]>([]);
  const [behavior, setBehavior] = useState<BehaviorRecord[]>([]);
  const [homework, setHomework] = useState<HomeworkRecord[]>([]);
  const [parents, setParents] = useState<ParentInfo[]>([]);
  const [medical, setMedical] = useState<MedicalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "attendance" | "marks" | "behavior" | "homework">("overview");

  useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/teacher/students/${studentId}`);
      if (response.ok) {
        const data = await response.json();
        setStudent(data.student);
        setAttendance(data.attendance || []);
        setMarks(data.marks || []);
        setBehavior(data.behavior || []);
        setHomework(data.homework || []);
        setParents(data.parents || []);
        setMedical(data.medical || null);
      } else {
        throw new Error("Failed to fetch student data");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast.error("Failed to load student data");
    } finally {
      setLoading(false);
    }
  };

  const calculateAttendancePercentage = () => {
    if (attendance.length === 0) return 0;
    const presentDays = attendance.filter((a) => a.status === "PRESENT").length;
    return Math.round((presentDays / attendance.length) * 100);
  };

  const calculateAverageMarks = () => {
    if (marks.length === 0) return 0;
    const totalPercentage = marks.reduce((sum, mark) => sum + mark.percentage, 0);
    return Math.round(totalPercentage / marks.length);
  };

  const sendMessageToParent = (parent: ParentInfo) => {
    router.push(`/teacher/messages?to=${parent.email}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Student not found</p>
      </div>
    );
  }

  const attendancePercentage = calculateAttendancePercentage();
  const averageMarks = calculateAverageMarks();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">
            {student.name} {student.surname}
          </h1>
          <p className="text-sm text-gray-500">{student.className}</p>
        </div>
      </div>

      {/* Student Info Card */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-indigo-600">
              {student.name[0]}{student.surname[0]}
            </span>
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Roll Number</p>
                <p className="text-sm font-medium text-gray-800">{student.rollNumber || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-800">{student.email || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm font-medium text-gray-800">{student.phone || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Date of Birth</p>
                <p className="text-sm font-medium text-gray-800">
                  {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <ClipboardCheck className="w-5 h-5 text-green-500" />
            <span className={`text-lg font-bold ${attendancePercentage >= 75 ? "text-green-600" : "text-red-600"}`}>
              {attendancePercentage}%
            </span>
          </div>
          <p className="text-xs text-gray-500">Attendance</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Trophy className="w-5 h-5 text-blue-500" />
            <span className="text-lg font-bold text-blue-600">{averageMarks}%</span>
          </div>
          <p className="text-xs text-gray-500">Average Marks</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="w-5 h-5 text-purple-500" />
            <span className="text-lg font-bold text-purple-600">
              {homework.filter((h) => h.status === "completed").length}/{homework.length}
            </span>
          </div>
          <p className="text-xs text-gray-500">Homework</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span className="text-lg font-bold text-orange-600">{behavior.length}</span>
          </div>
          <p className="text-xs text-gray-500">Behavior Records</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: User },
            { id: "attendance", label: "Attendance", icon: ClipboardCheck },
            { id: "marks", label: "Marks", icon: Trophy },
            { id: "behavior", label: "Behavior", icon: AlertTriangle },
            { id: "homework", label: "Homework", icon: BookOpen },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Parents */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Parent/Guardian Information
                </h3>
                {parents.length > 0 ? (
                  <div className="space-y-3">
                    {parents.map((parent, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-800">{parent.name}</p>
                            <p className="text-sm text-gray-500">{parent.relation}</p>
                            <p className="text-sm text-gray-600 mt-1">{parent.phone}</p>
                            {parent.email && <p className="text-sm text-gray-600">{parent.email}</p>}
                          </div>
                          <button
                            onClick={() => sendMessageToParent(parent)}
                            className="flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-sm">Message</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No parent information available</p>
                )}
              </div>

              {/* Medical Info */}
              {medical && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <HeartPulse className="w-4 h-4" />
                    Medical Information
                  </h3>
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="font-medium text-gray-800">{medical.condition}</p>
                    <p className="text-sm text-gray-600 mt-1">{medical.notes}</p>
                    <p className="text-sm text-red-600 mt-2">
                      Emergency: {medical.emergencyContact}
                    </p>
                  </div>
                </div>
              )}

              {/* Fee Status (Read Only) */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Fee Status
                </h3>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-green-800">All fees paid</p>
                      <p className="text-sm text-green-600">No outstanding payments</p>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === "attendance" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Attendance History</h3>
                <span className="text-sm text-gray-500">{attendancePercentage}% overall</span>
              </div>
              {attendance.length > 0 ? (
                <div className="space-y-2">
                  {attendance.map((record, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-800">
                          {new Date(record.date).toLocaleDateString()}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          record.status === "PRESENT"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {record.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No attendance records</p>
              )}
            </div>
          )}

          {/* Marks Tab */}
          {activeTab === "marks" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Academic Performance</h3>
                <span className="text-sm text-gray-500">{averageMarks}% average</span>
              </div>
              {marks.length > 0 ? (
                <div className="space-y-2">
                  {marks.map((mark, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{mark.subject}</p>
                        <p className="text-sm text-gray-500">{mark.exam}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          {mark.score}/{mark.maxMarks}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            mark.percentage >= 75
                              ? "bg-green-100 text-green-700"
                              : mark.percentage >= 50
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {mark.grade}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No marks recorded</p>
              )}
            </div>
          )}

          {/* Behavior Tab */}
          {activeTab === "behavior" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 mb-4">Behavior Records</h3>
              {behavior.length > 0 ? (
                <div className="space-y-3">
                  {behavior.map((record, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        record.type === "WARNING"
                          ? "bg-yellow-50 border border-yellow-200"
                          : record.type === "DETENTION"
                          ? "bg-orange-50 border border-orange-200"
                          : "bg-red-50 border border-red-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              record.type === "WARNING"
                                ? "bg-yellow-200 text-yellow-800"
                                : record.type === "DETENTION"
                                ? "bg-orange-200 text-orange-800"
                                : "bg-red-200 text-red-800"
                            }`}
                          >
                            {record.type}
                          </span>
                          <p className="text-sm text-gray-600 mt-2">{record.description}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(record.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No behavior records</p>
              )}
            </div>
          )}

          {/* Homework Tab */}
          {activeTab === "homework" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 mb-4">Homework Completion</h3>
              {homework.length > 0 ? (
                <div className="space-y-2">
                  {homework.map((hw, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{hw.title}</p>
                        <p className="text-sm text-gray-500">{hw.subject}</p>
                        <p className="text-xs text-gray-400">
                          Due: {new Date(hw.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            hw.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : hw.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {hw.status}
                        </span>
                        {hw.score !== undefined && (
                          <p className="text-sm text-gray-600 mt-1">{hw.score}%</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No homework records</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Download Report Button */}
      <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
        <Download className="w-5 h-5" />
        Download Full Report
      </button>
    </div>
  );
}
