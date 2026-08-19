"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  ClipboardCheck,
  Trophy,
  BookOpen,
  MessageSquare,
  Calendar,
  User,
  Users,
  Bell,
  FileText,
  CheckCircle2,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: Home, href: "/teacher" },
  { id: "classroom", label: "My Classroom", icon: BookOpen, href: "/teacher/classroom" },
  { id: "students", label: "Students", icon: Users, href: "/teacher/students" },
  { id: "attendance", label: "Attendance", icon: ClipboardCheck, href: "/teacher/attendance" },
  { id: "marks", label: "Marks", icon: Trophy, href: "/teacher/marks" },
  { id: "homework", label: "Homework", icon: BookOpen, href: "/teacher/homework" },
  { id: "timetable", label: "Timetable", icon: Calendar, href: "/teacher/timetable" },
  { id: "diary", label: "Class Diary", icon: FileText, href: "/teacher/diary" },
  { id: "exams", label: "Exams", icon: CheckCircle2, href: "/teacher/exams" },
  { id: "assignments", label: "Assignments", icon: FileText, href: "/teacher/assignments" },
  { id: "messages", label: "Messages", icon: MessageSquare, href: "/teacher/messages" },
  { id: "announcements", label: "Announcements", icon: Bell, href: "/teacher/announcements" },
  { id: "analytics", label: "Analytics", icon: BarChart3, href: "/teacher/analytics" },
  { id: "leave", label: "Leave", icon: Calendar, href: "/teacher/leave" },
  { id: "profile", label: "Profile", icon: User, href: "/teacher/profile" },
];

interface TeacherSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function TeacherSidebar({
  isCollapsed,
  onToggle,
  isMobile,
  mobileOpen,
  onMobileClose,
}: TeacherSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const currentTab = NAV_ITEMS.find((item) => pathname.startsWith(item.href))?.id || "dashboard";
    setActiveTab(currentTab);
  }, [pathname]);

  const handleNavigation = (href: string) => {
    router.push(href);
    if (isMobile) onMobileClose();
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white/80 backdrop-blur-lg border-r border-gray-200/50 transition-all duration-300">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200/50">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-lg shadow-indigo-500/30 overflow-hidden">
              <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
            </div>
            <span className="font-semibold text-gray-900">Alpha Edu</span>
          </div>
        )}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8 hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.href)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group hover-lift",
              activeTab === item.id
                ? "bg-indigo-50/80 text-indigo-700 font-medium shadow-sm"
                : "text-gray-600 hover:bg-gray-100/80"
            )}
          >
            <item.icon
              className={cn(
                "h-5 w-5 flex-shrink-0 transition-colors",
                activeTab === item.id
                  ? "text-indigo-600"
                  : "text-gray-400 group-hover:text-gray-600"
              )}
            />
            {!isCollapsed && (
              <span className="truncate text-sm">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-gray-200/50 p-3 space-y-1">
        <button
          onClick={() => {
            fetch("/api/auth/logout", { method: "POST", credentials: "include" })
              .catch(() => console.log("Logout failed"));
            window.location.href = "/sign-in";
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50/80 transition-all hover-lift"
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onMobileClose}
          />
        )}
        {/* Mobile Sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:hidden",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-lg shadow-indigo-500/30 overflow-hidden">
                  <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
                </div>
                <span className="font-semibold text-gray-900">Alpha Edu</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onMobileClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {sidebarContent}
          </div>
        </div>
      </>
    );
  }

  return (
    <div
      className={cn(
        "hidden lg:flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {sidebarContent}
    </div>
  );
}