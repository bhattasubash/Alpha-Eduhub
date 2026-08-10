"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  FileText,
  ClipboardList,
  Star,
  Users,
  FolderOpen,
  DollarSign,
  Activity,
  Send,
  User,
} from "lucide-react";

const navigationItems = [
  { name: "Overview", href: "/student", icon: LayoutDashboard },
  { name: "Academics", href: "/student/academics", icon: BookOpen },
  { name: "Attendance", href: "/student/attendance", icon: Calendar },
  { name: "Exams", href: "/student/exams", icon: FileText },
  { name: "Assignments", href: "/student/assignments", icon: ClipboardList },
  { name: "Leave", href: "/student/leave", icon: Send },
  { name: "Behaviour", href: "/student/behaviour", icon: Star },
  { name: "Parents", href: "/student/parents", icon: Users },
  { name: "Documents", href: "/student/documents", icon: FolderOpen },
  { name: "Fees", href: "/student/fees", icon: DollarSign },
  { name: "Activity", href: "/student/activity", icon: Activity },
  { name: "Profile", href: "/student/profile", icon: User },
];

export default function ProfileNavigation() {
  const pathname = usePathname();

  return (
    <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
      <nav className="flex overflow-x-auto scrollbar-hide">
        <div className="flex-1 flex items-center gap-1 px-4 md:px-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/student" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                  isActive
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
