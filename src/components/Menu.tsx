import Link from "next/link";
import { getRole } from "@/lib/getRole";
import LogoutMenuItem from "./LogoutMenuItem";
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  BarChart3,
  Activity,
  HelpCircle,
  Megaphone,
  FileText,
  GraduationCap,
  BookOpen,
  BookMarked,
  FileSpreadsheet,
  ClipboardList,
  Award,
  CalendarCheck,
  Calendar,
  MessageSquare,
  User,
  Settings,
  School,
  LucideIcon,
} from "lucide-react";

interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
  visible: string[];
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    title: "PLATFORM & OVERSIGHT",
    items: [
      { icon: LayoutDashboard, label: "Platform Overview", href: "/super-admin", visible: ["SUPER_ADMIN"] },
      { icon: Building2, label: "Schools Directory", href: "/super-admin/schools", visible: ["SUPER_ADMIN"] },
      { icon: Users, label: "User Access", href: "/super-admin/users", visible: ["SUPER_ADMIN"] },
      { icon: CreditCard, label: "Subscriptions", href: "/super-admin/subscriptions", visible: ["SUPER_ADMIN"] },
      { icon: BarChart3, label: "System Analytics", href: "/super-admin/analytics", visible: ["SUPER_ADMIN"] },
      { icon: Activity, label: "Service Health", href: "/super-admin/monitoring", visible: ["SUPER_ADMIN"] },
      { icon: HelpCircle, label: "Support Requests", href: "/super-admin/support", visible: ["SUPER_ADMIN"] },
      { icon: Megaphone, label: "Broadcasts", href: "/super-admin/announcements", visible: ["SUPER_ADMIN"] },
      { icon: FileText, label: "Audit Trails", href: "/super-admin/audit", visible: ["SUPER_ADMIN"] },
      { icon: Building2, label: "Schools", href: "/provider/schools", visible: ["provider"] },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      { icon: LayoutDashboard, label: "Overview", href: "/admin", visible: ["admin", "SCHOOL_ADMIN"] },
      { icon: LayoutDashboard, label: "Overview", href: "/provider", visible: ["provider"] },
      { icon: LayoutDashboard, label: "Dashboard", href: "/teacher", visible: ["teacher", "TEACHER"] },
      { icon: School, label: "My Classroom", href: "/teacher/classroom", visible: ["teacher", "TEACHER"] },
      { icon: LayoutDashboard, label: "Dashboard", href: "/student", visible: ["student", "STUDENT"] },
      { icon: LayoutDashboard, label: "Dashboard", href: "/parent", visible: ["PARENT"] },
      { icon: GraduationCap, label: "Faculty", href: "/list/teachers", visible: ["admin", "SCHOOL_ADMIN", "provider"] },
      { icon: Users, label: "Students", href: "/list/students", visible: ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER", "provider"] },
      { icon: Users, label: "Guardians", href: "/list/parents", visible: ["admin", "SCHOOL_ADMIN", "provider"] },
      { icon: School, label: "Classes", href: "/list/classes", visible: ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER"] },
      { icon: BookOpen, label: "Curriculum", href: "/list/subjects", visible: ["admin", "SCHOOL_ADMIN"] },
      { icon: BookMarked, label: "Lessons", href: "/list/lessons", visible: ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER"] },
    ],
  },
  {
    title: "ACADEMICS & OPERATIONS",
    items: [
      { icon: CalendarCheck, label: "Attendance", href: "/list/attendance", visible: ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER", "student", "STUDENT"] },
      { icon: ClipboardList, label: "Assignments", href: "/list/assignments", visible: ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER", "student", "STUDENT"] },
      { icon: FileSpreadsheet, label: "Exams", href: "/list/exams", visible: ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER", "student", "STUDENT"] },
      { icon: Award, label: "Gradebook", href: "/list/results", visible: ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER", "student", "STUDENT"] },
      { icon: Calendar, label: "School Calendar", href: "/list/events", visible: ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER", "student", "STUDENT"] },
      { icon: MessageSquare, label: "Messages", href: "/list/messages", visible: ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER", "student", "STUDENT"] },
      { icon: Megaphone, label: "Announcements", href: "/list/announcements", visible: ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER", "student", "STUDENT"] },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      { icon: Settings, label: "Settings", href: "/super-admin/settings", visible: ["SUPER_ADMIN"] },
      { icon: User, label: "Profile", href: "/profile", visible: ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER", "student", "STUDENT"] },
      { icon: Settings, label: "Preferences", href: "/settings", visible: ["admin", "SCHOOL_ADMIN"] },
    ],
  },
];

const Menu = async () => {
  const role = await getRole();
  if (!role) return null;

  return (
    <nav className="text-xs space-y-6 pb-6" aria-label="Sidebar Navigation">
      {menuSections.map((section) => {
        const visibleItems = section.items.filter((item) => item.visible.includes(role));
        if (visibleItems.length === 0) return null;

        return (
          <div key={section.title} className="space-y-1">
            <p className="hidden lg:block text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {visibleItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className="flex items-center justify-center lg:justify-start gap-3 text-slate-600 hover:text-blue-700 hover:bg-blue-50/70 active:bg-blue-100/70 py-2 px-2.5 rounded-lg transition-all font-medium group"
                  >
                    <IconComponent
                      className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0"
                      strokeWidth={1.75}
                    />
                    <span className="hidden lg:block truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Logout Action */}
      <div className="pt-2 border-t border-slate-100">
        <LogoutMenuItem label="Sign Out" />
      </div>
    </nav>
  );
};

export default Menu;
