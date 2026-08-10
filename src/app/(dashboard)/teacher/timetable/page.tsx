"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  List,
  Search,
  Filter,
  BookOpen,
  AlertTriangle,
} from "lucide-react";

type Lesson = {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  subjectName: string;
  className: string;
  roomNumber?: string;
  studentCount: number;
};

type TimetableData = {
  lessons: Lesson[];
  teacherName: string;
  subjects: string[];
  classes: string[];
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const DAY_KEYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

export default function TeacherTimetablePage() {
  const router = useRouter();

  // States
  const [timetableData, setTimetableData] = useState<TimetableData | null>(null);
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("weekly");
  
  // Set initial day based on current day of week
  const currentDayIndex = new Date().getDay();
  const initialDay = currentDayIndex >= 1 && currentDayIndex <= 5 ? DAY_KEYS[currentDayIndex - 1] : "MONDAY";
  
  const [selectedDay, setSelectedDay] = useState<string>(initialDay);
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/teacher/timetable");
      if (response.ok) {
        const data = await response.json();
        setTimetableData(data);
      } else {
        throw new Error("Failed to fetch timetable");
      }
    } catch (error) {
      console.error("Error fetching timetable:", error);
      toast.error("Failed to load timetable");
    } finally {
      setLoading(false);
    }
  };

  const getLessonsForDay = (day: string) => {
    if (!timetableData) return [];
    return timetableData.lessons.filter((lesson) => lesson.day === day);
  };

  const getTodayLessons = () => {
    return getLessonsForDay(selectedDay);
  };

  const getWeekLessons = () => {
    if (!timetableData) return [];
    return timetableData.lessons;
  };

  const filteredLessons = (lessons: Lesson[]) => {
    return lessons.filter((lesson) => {
      const matchesSearch =
        lesson.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.className.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === "all" || lesson.subjectName === selectedSubject;
      const matchesClass = selectedClass === "all" || lesson.className === selectedClass;
      return matchesSearch && matchesSubject && matchesClass;
    });
  };

  const getNextLesson = () => {
    const todayLessons = getTodayLessons();
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    return todayLessons.find((lesson) => {
      const [hours, minutes] = lesson.startTime.split(":").map(Number);
      const lessonTime = hours * 60 + minutes;
      return lessonTime > currentTime;
    });
  };

  const getCurrentLesson = () => {
    const todayLessons = getTodayLessons();
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    return todayLessons.find((lesson) => {
      const [startHours, startMinutes] = lesson.startTime.split(":").map(Number);
      const [endHours, endMinutes] = lesson.endTime.split(":").map(Number);
      const startTime = startHours * 60 + startMinutes;
      const endTime = endHours * 60 + endMinutes;
      return currentTime >= startTime && currentTime <= endTime;
    });
  };

  const navigateDay = (direction: "prev" | "next") => {
    const currentIndex = DAY_KEYS.indexOf(selectedDay);
    let newIndex = currentIndex + (direction === "next" ? 1 : -1);
    if (newIndex < 0) newIndex = DAY_KEYS.length - 1;
    if (newIndex >= DAY_KEYS.length) newIndex = 0;
    setSelectedDay(DAY_KEYS[newIndex]);
  };

  const detectConflicts = (lessons: Lesson[]) => {
    const conflicts: { [key: string]: Lesson[] } = {};
    
    lessons.forEach((lesson) => {
      const key = `${lesson.day}-${lesson.startTime}`;
      if (!conflicts[key]) {
        conflicts[key] = [];
      }
      conflicts[key].push(lesson);
    });

    return Object.entries(conflicts).filter(([_, lessons]) => lessons.length > 1);
  };

  const currentLesson = getCurrentLesson();
  const nextLesson = getNextLesson();
  const conflicts = detectConflicts(timetableData?.lessons || []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Timetable</h1>
          <p className="text-sm text-gray-500">View your teaching schedule</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("daily")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              viewMode === "daily" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <List className="w-4 h-4" />
            <span className="text-sm font-medium">Daily</span>
          </button>
          <button
            onClick={() => setViewMode("weekly")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              viewMode === "weekly" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Grid3x3 className="w-4 h-4" />
            <span className="text-sm font-medium">Weekly</span>
          </button>
        </div>
      </div>

      {/* Current/Next Lesson Info */}
      {(currentLesson || nextLesson) && (
        <div className={`rounded-xl p-4 ${
          currentLesson ? "bg-green-50 border border-green-200" : "bg-blue-50 border border-blue-200"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              currentLesson ? "bg-green-100" : "bg-blue-100"
            }`}>
              <Clock className={`w-6 h-6 ${currentLesson ? "text-green-600" : "text-blue-600"}`} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">
                {currentLesson ? "Current Class" : "Next Class"}
              </p>
              <p className="text-sm text-gray-600">
                {(currentLesson || nextLesson)?.subjectName} • {(currentLesson || nextLesson)?.className}
              </p>
              <p className="text-xs text-gray-500">
                {(currentLesson || nextLesson)?.startTime} - {(currentLesson || nextLesson)?.endTime}
                {(currentLesson || nextLesson)?.roomNumber && ` • Room ${(currentLesson || nextLesson)?.roomNumber}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Conflict Alerts */}
      {conflicts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-semibold text-red-800">Schedule Conflicts Detected</p>
              <p className="text-sm text-red-600">
                {conflicts.length} conflict(s) found in your timetable
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Subjects</option>
            {timetableData?.subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Classes</option>
            {timetableData?.classes.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Daily View */}
      {viewMode === "daily" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <button
              onClick={() => navigateDay("prev")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="text-center">
              <h2 className="font-semibold text-gray-800">{DAYS[DAY_KEYS.indexOf(selectedDay)]}</h2>
              <p className="text-sm text-gray-500">
                {filteredLessons(getTodayLessons()).length} classes
              </p>
            </div>
            <button
              onClick={() => navigateDay("next")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            {filteredLessons(getTodayLessons()).map((lesson) => {
              const isCurrent = currentLesson?.id === lesson.id;
              const isNext = nextLesson?.id === lesson.id;
              
              return (
                <div
                  key={lesson.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? "bg-green-50 border-green-200 shadow-sm"
                      : isNext
                      ? "bg-blue-50 border-blue-200"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                        <h3 className="font-semibold text-gray-800">{lesson.subjectName}</h3>
                        {isCurrent && (
                          <span className="px-2 py-0.5 bg-green-200 text-green-800 text-xs rounded-full">
                            Now
                          </span>
                        )}
                        {isNext && (
                          <span className="px-2 py-0.5 bg-blue-200 text-blue-800 text-xs rounded-full">
                            Next
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{lesson.startTime} - {lesson.endTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{lesson.className}</span>
                        </div>
                        {lesson.roomNumber && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>Room {lesson.roomNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{lesson.studentCount} students</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredLessons(getTodayLessons()).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No classes scheduled for this day</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Weekly View */}
      {viewMode === "weekly" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-5 border-b border-gray-200">
            {DAYS.map((day, index) => (
              <div
                key={day}
                onClick={() => {
                  setViewMode("daily");
                  setSelectedDay(DAY_KEYS[index]);
                }}
                className={`p-3 text-center cursor-pointer transition-colors ${
                  selectedDay === DAY_KEYS[index] ? "bg-indigo-50" : "hover:bg-gray-50"
                }`}
              >
                <p className="text-xs font-medium text-gray-500">{day.substring(0, 3).toLowerCase()}</p>
                <p className="text-lg font-bold text-gray-800">{index + 1}</p>
              </div>
            ))}
          </div>

          <div className="divide-y divide-gray-200">
            {[...Array(8)].map((_, periodIndex) => {
              const periodStart = `${8 + periodIndex}:00`;
              const periodEnd = `${8 + periodIndex + 1}:00`;
              
              return (
                <div key={periodIndex} className="grid grid-cols-6 border-b border-gray-100">
                  <div className="p-3 text-center border-r border-gray-200 bg-gray-50">
                    <p className="text-xs text-gray-500">Period {periodIndex + 1}</p>
                    <p className="text-sm font-medium text-gray-800">{periodStart}</p>
                  </div>
                  {DAY_KEYS.map((day, dayIndex) => {
                    const dayLessons = filteredLessons(getLessonsForDay(day)).filter(
                      (lesson) => lesson.startTime === periodStart
                    );
                    
                    return (
                      <div key={day} className="p-2 border-r border-gray-100 min-h-[60px]">
                        {dayLessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="bg-indigo-50 border border-indigo-200 rounded-lg p-2 mb-1 text-xs"
                          >
                            <p className="font-medium text-indigo-800 truncate">{lesson.subjectName}</p>
                            <p className="text-indigo-600 truncate">{lesson.className}</p>
                            {lesson.roomNumber && (
                              <p className="text-indigo-500">R{lesson.roomNumber}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            <span className="text-2xl font-bold text-gray-800">
              {timetableData?.lessons.length || 0}
            </span>
          </div>
          <p className="text-xs text-gray-500">Total Classes/Week</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-green-500" />
            <span className="text-2xl font-bold text-gray-800">
              {timetableData?.classes.length || 0}
            </span>
          </div>
          <p className="text-xs text-gray-500">Different Classes</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            <span className="text-2xl font-bold text-gray-800">
              {timetableData?.subjects.length || 0}
            </span>
          </div>
          <p className="text-xs text-gray-500">Subjects Taught</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <span className="text-2xl font-bold text-gray-800">
              {timetableData?.lessons.length || 0 * 1}
            </span>
          </div>
          <p className="text-xs text-gray-500">Hours/Week</p>
        </div>
      </div>
    </div>
  );
}
