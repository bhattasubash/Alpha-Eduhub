"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  CheckCircle2,
  XCircle,
  Clock,
  UserX,
  Calendar,
  Search,
  Save,
  Users,
  Filter,
  MoreVertical,
  Download,
  Upload,
  RotateCcw,
  Wifi,
  WifiOff,
} from "lucide-react";

type Student = {
  id: string;
  name: string;
  surname: string;
  classId: number;
  className: string;
};
type Lesson = { id: number; name: string; classId: number; className: string; subjectName: string };

type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "HALF_DAY" | "MEDICAL_LEAVE" | "EXCUSED_LEAVE";

const ATTENDANCE_STATUS: { value: AttendanceStatus; label: string; color: string; icon: any }[] = [
  { value: "PRESENT", label: "Present", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2 },
  { value: "ABSENT", label: "Absent", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
];

export default function AttendancePage() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const hasUnsavedChanges = useRef(false);

  // Data states
  const [students, setStudents] = useState<Student[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedLesson, setSelectedLesson] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [attendanceHistory, setAttendanceHistory] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Fetch data
  useEffect(() => {
    fetchStudents();
    fetchLessons();
  }, []);

  useEffect(() => {
    if (selectedLesson) fetchAttendanceHistory();
  }, [selectedDate, selectedLesson]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges.current) {
      if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
      
      const timeout = setTimeout(() => {
        saveAttendance(true); // Auto save
      }, 5000); // Auto save after 5 seconds of inactivity
      
      setAutoSaveTimeout(timeout);
    }

    return () => {
      if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
    };
  }, [attendance]);

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/teacher/students");
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
        
        // Initialize attendance as all present
        const initialAttendance: Record<string, AttendanceStatus> = {};
        data.forEach((student: Student) => {
          initialAttendance[student.id] = "PRESENT";
        });
        setAttendance(initialAttendance);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
      toast.error("Failed to load students");
    }
  };

  const fetchLessons = async () => {
    const response = await fetch("/api/teacher/lessons");
    if (!response.ok) return;
    const data = await response.json() as { lessons: Lesson[] };
    setLessons(data.lessons);
  };

  const fetchAttendanceHistory = async () => {
    try {
      const response = await fetch(`/api/teacher/attendance?lessonId=${selectedLesson}&date=${selectedDate}`);
      if (response.ok) {
        const data = await response.json() as { records: { studentId: string; present: boolean }[] };
        setAttendanceHistory(data.records);
        setAttendance((previous) => ({ ...previous, ...Object.fromEntries(data.records.map((record) => [record.studentId, record.present ? "PRESENT" : "ABSENT"])) }));
      }
    } catch (error) {
      console.error("Failed to fetch attendance history:", error);
    }
  };

  const markAllPresent = () => {
    const newAttendance: Record<string, AttendanceStatus> = {};
    filteredStudents.forEach((student) => {
      newAttendance[student.id] = "PRESENT";
    });
    setAttendance(newAttendance);
    hasUnsavedChanges.current = true;
    toast.success("All students marked as present");
  };

  const markAllAbsent = () => {
    const newAttendance: Record<string, AttendanceStatus> = {};
    filteredStudents.forEach((student) => {
      newAttendance[student.id] = "ABSENT";
    });
    setAttendance(newAttendance);
    hasUnsavedChanges.current = true;
    toast.success("All students marked as absent");
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
    hasUnsavedChanges.current = true;
  };

  const saveAttendance = async (isAutoSave = false) => {
    if (!selectedLesson) {
      if (!isAutoSave) toast.error("Select a class and lesson before saving attendance.");
      return;
    }
    if (!isOnline && !isAutoSave) {
      // Save to localStorage for offline
      localStorage.setItem("attendance_draft", JSON.stringify({
        date: selectedDate,
        classId: selectedClass,
        attendance,
        timestamp: new Date().toISOString(),
      }));
      toast.success("Saved offline. Will sync when online.");
      hasUnsavedChanges.current = false;
      setLastSaved(new Date());
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/teacher/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          lessonId: Number(selectedLesson),
          records: Object.entries(attendance).map(([studentId, status]) => ({
            studentId,
            present: status === "PRESENT",
          })),
        }),
      });

      if (response.ok) {
        if (!isAutoSave) {
          toast.success("Attendance saved successfully!");
        }
        hasUnsavedChanges.current = false;
        setLastSaved(new Date());
        
        // Clear offline draft if exists
        localStorage.removeItem("attendance_draft");
      } else {
        throw new Error("Failed to save attendance");
      }
    } catch (error) {
      console.error("Error saving attendance:", error);
      if (!isAutoSave) {
        toast.error("Failed to save attendance. Saved as draft.");
        // Save as draft
        localStorage.setItem("attendance_draft", JSON.stringify({
          date: selectedDate,
          classId: selectedClass,
          attendance,
          timestamp: new Date().toISOString(),
        }));
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Load offline draft on mount
  useEffect(() => {
    const draft = localStorage.getItem("attendance_draft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (confirm("You have unsaved attendance. Would you like to restore it?")) {
          setSelectedDate(parsed.date);
          setSelectedClass(parsed.classId);
          setAttendance(parsed.attendance);
          toast.info("Draft restored");
        }
      } catch (error) {
        console.error("Failed to parse draft:", error);
      }
    }
  }, []);

  // Sync when coming back online
  useEffect(() => {
    if (isOnline) {
      const draft = localStorage.getItem("attendance_draft");
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          setAttendance(parsed.attendance);
          saveAttendance(true);
          toast.success("Synced offline changes");
        } catch (error) {
          console.error("Failed to sync draft:", error);
        }
      }
    }
  }, [isOnline]);

  const filteredStudents = students.filter((student) => {
    const matchesClass = !!selectedClass && student.classId.toString() === selectedClass;
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.surname.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const uniqueClasses = Array.from(new Map(students.map((student) => [student.classId, student.className])).entries());
  const availableLessons = lessons.filter((lesson) => lesson.classId.toString() === selectedClass);

  const getAttendanceStats = () => {
    const stats = {
      present: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
      medical: 0,
      excused: 0,
    };

    Object.values(attendance).forEach((status) => {
      switch (status) {
        case "PRESENT": stats.present++; break;
        case "ABSENT": stats.absent++; break;
        case "LATE": stats.late++; break;
        case "HALF_DAY": stats.halfDay++; break;
        case "MEDICAL_LEAVE": stats.medical++; break;
        case "EXCUSED_LEAVE": stats.excused++; break;
      }
    });

    return stats;
  };

  const stats = getAttendanceStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mark Attendance</h1>
          <p className="text-sm text-gray-500">Quick and easy attendance tracking</p>
        </div>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <Wifi className="w-4 h-4" />
              Online
            </div>
          ) : (
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <WifiOff className="w-4 h-4" />
              Offline
            </div>
          )}
          {lastSaved && (
            <span className="text-xs text-gray-400">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={markAllPresent}
          className="flex items-center justify-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors"
        >
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="font-medium text-green-700">All Present</span>
        </button>
        <button
          onClick={markAllAbsent}
          className="flex items-center justify-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
        >
          <XCircle className="w-5 h-5 text-red-600" />
          <span className="font-medium text-red-700">All Absent</span>
        </button>
        <button
          onClick={() => {
            if (confirm("Undo all changes?")) {
              markAllPresent();
            }
          }}
          className="flex items-center justify-center gap-2 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <RotateCcw className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-700">Reset</span>
        </button>
        <button
          onClick={() => saveAttendance(false)}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 p-4 bg-indigo-600 border border-indigo-700 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5 text-white" />
          <span className="font-medium text-white">{isSaving ? "Saving..." : "Save"}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => { setSelectedClass(e.target.value); setSelectedLesson(""); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a class</option>
              {uniqueClasses.map(([classId, className]) => (
                <option key={classId} value={classId}>
                  {className}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lesson</label>
            <select value={selectedLesson} onChange={(e) => setSelectedLesson(e.target.value)} disabled={!selectedClass} className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100">
              <option value="">Select a lesson</option>
              {availableLessons.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.subjectName} — {lesson.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Student</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-green-700">{stats.present}</p>
          <p className="text-xs text-green-600">Present</p>
        </div>
        <div className="bg-red-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-red-700">{stats.absent}</p>
          <p className="text-xs text-red-600">Absent</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-yellow-700">{stats.late}</p>
          <p className="text-xs text-yellow-600">Late</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-orange-700">{stats.halfDay}</p>
          <p className="text-xs text-orange-600">Half Day</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-blue-700">{stats.medical}</p>
          <p className="text-xs text-blue-600">Medical</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-purple-700">{stats.excused}</p>
          <p className="text-xs text-purple-600">Excused</p>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold text-gray-800">
              Students ({filteredStudents.length})
            </h2>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-indigo-600">
                      {student.name[0]}{student.surname[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {student.name} {student.surname}
                    </p>
                    <p className="text-sm text-gray-500">{student.className}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {ATTENDANCE_STATUS.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => handleStatusChange(student.id, status.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        attendance[student.id] === status.value
                          ? status.color
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No students found matching your criteria
          </div>
        )}
      </div>

      {/* Sticky Save Button (Mobile) */}
      <div className="md:hidden fixed bottom-20 left-4 right-4 z-40">
        <button
          onClick={() => saveAttendance(false)}
          disabled={isSaving}
          className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Attendance"}
        </button>
      </div>
    </div>
  );
}
