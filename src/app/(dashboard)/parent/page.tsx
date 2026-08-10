"use client";

import { useState, useEffect } from "react";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import StudentAttendanceCard from "@/components/StudentAttendanceCard";
import ParentAnnouncements from "@/components/parent/ParentAnnouncements";
import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  TrendingUp,
  Bell,
} from "lucide-react";

interface Child {
  id: string;
  name: string;
  surname: string;
  admissionNumber?: string;
  rollNumber?: string;
  img?: string;
  class: { id: number; name: string } | null;
  grade: { level: number } | null;
  section?: string;
  relationshipType: string;
  isPrimary: boolean;
}

interface ChildStats {
  attendance: { percentage: number; present: number; total: number };
  academics: { overallPercentage: number; resultsCount: number };
  assignments: { pending: number; submissionsCount: number };
  exams: { upcoming: number };
  fees: { total: number; paid: number; pending: number; status: string };
}

export default function ParentPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [childStats, setChildStats] = useState<ChildStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [parentName, setParentName] = useState("Parent");

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchChildStats(selectedChild.id);
    }
  }, [selectedChild]);

  const fetchChildren = async () => {
    try {
      const response = await fetch("/api/parent/children");
      if (response.ok) {
        const data = await response.json();
        setChildren(data);
        if (data.length > 0) {
          // Select primary child or first child
          const primary = data.find((c: Child) => c.isPrimary) || data[0];
          setSelectedChild(primary);
        }
      }
    } catch (error) {
      console.error("Error fetching children:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChildStats = async (studentId: string) => {
    try {
      const response = await fetch(`/api/parent/children/${studentId}`);
      if (response.ok) {
        const data = await response.json();
        setChildStats(data);
      }
    } catch (error) {
      console.error("Error fetching child stats:", error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3 flex flex-col gap-6">
        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-indigo-100">
                {getGreeting()} 👋
              </p>
              <h1 className="text-2xl font-bold mt-1">{parentName}</h1>
              <p className="text-xs text-indigo-200 mt-1">
                {children.length === 0
                  ? "No children linked yet"
                  : `${children.length} child${children.length > 1 ? "ren" : ""} enrolled`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                <Bell className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Child Selector */}
        {children.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700">Select Child</h2>
              <span className="text-xs text-gray-500">
                {children.length} {children.length === 1 ? "child" : "children"}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChild(child)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedChild?.id === child.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {child.img ? (
                        <img
                          src={child.img}
                          alt={child.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        `${child.name[0]}${child.surname[0]}`
                      )}
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {child.name} {child.surname}
                      </p>
                      <p className="text-xs text-gray-500">
                        {child.grade ? `Grade ${child.grade.level}` : ""}{" "}
                        {child.class?.name && `· ${child.class.name}`}
                      </p>
                    </div>
                    {child.isPrimary && (
                      <div className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                        Primary
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {children.length === 0 && !loading && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
            <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No students linked to this account.</p>
            <p className="text-gray-300 text-sm mt-1">
              Contact your school admin to link your children.
            </p>
          </div>
        )}

        {/* Selected Child Overview */}
        {selectedChild && childStats && (
          <div className="flex flex-col gap-4">
            {/* Child header */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl px-5 py-4 border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {selectedChild.img ? (
                    <img
                      src={selectedChild.img}
                      alt={selectedChild.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    `${selectedChild.name[0]}${selectedChild.surname[0]}`
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">
                    {selectedChild.name} {selectedChild.surname}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedChild.admissionNumber && `ID: ${selectedChild.admissionNumber} · `}
                    {selectedChild.grade ? `Grade ${selectedChild.grade.level}` : ""}
                    {selectedChild.class?.name && ` · ${selectedChild.class.name}`}
                    {selectedChild.section && ` · ${selectedChild.section}`}
                  </p>
                </div>
                <div className="text-right">
                  <StudentAttendanceCard id={selectedChild.id} />
                </div>
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xs text-gray-500">Academic</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {childStats.academics.overallPercentage}%
                </p>
                <p className="text-xs text-gray-500">Overall Score</p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <CalendarDays className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-xs text-gray-500">Attendance</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {childStats.attendance.percentage}%
                </p>
                <p className="text-xs text-gray-500">
                  {childStats.attendance.present}/{childStats.attendance.total} days
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-xs text-gray-500">Assignments</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {childStats.assignments.pending}
                </p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-xs text-gray-500">Exams</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {childStats.exams.upcoming}
                </p>
                <p className="text-xs text-gray-500">Upcoming</p>
              </div>
            </div>

            {/* Fee status */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">Fee Status</h4>
                  <p className="text-sm text-gray-500">
                    Total: ${childStats.fees.total} · Paid: ${childStats.fees.paid}
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    childStats.fees.status === "PAID"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {childStats.fees.status === "PAID" ? "Paid" : `Pending: $${childStats.fees.pending}`}
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-base font-semibold text-gray-700 mb-3">
                {selectedChild.name}&apos;s Schedule
              </h2>
              <BigCalendarContainer type="classId" id={selectedChild.class?.id || 0} />
            </div>
          </div>
        )}

        {/* Quick actions */}
        {selectedChild && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Academics", href: `/parent/children/${selectedChild.id}/academics`, emoji: "📚", color: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100" },
              { label: "Attendance", href: `/parent/children/${selectedChild.id}/attendance`, emoji: "✅", color: "bg-green-50 border-green-200 text-green-700 hover:bg-green-100" },
              { label: "Assignments", href: `/parent/children/${selectedChild.id}/assignments`, emoji: "�", color: "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100" },
              { label: "Leave", href: `/parent/children/${selectedChild.id}/leave`, emoji: "🏖️", color: "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100" },
              { label: "Fees", href: `/parent/children/${selectedChild.id}/fees`, emoji: "�", color: "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100" },
              { label: "Announcements", href: `/parent/children/${selectedChild.id}/announcements`, emoji: "📢", color: "bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100" },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className={`border rounded-xl p-3 flex items-center gap-2.5 text-sm font-semibold transition-colors ${action.color}`}
              >
                <span className="text-lg">{action.emoji}</span>
                {action.label}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6">
        <ParentAnnouncements />
      </div>
    </div>
  );
}
