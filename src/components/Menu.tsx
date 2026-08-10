import Image from "next/image";
import Link from "next/link";
import { getRole } from "@/lib/getRole";

const menuItems = [
  {
    title: "MENU",
    items: [
      // Super Admin home
      { icon: "/home.png",    label: "Dashboard",  href: "/super-admin",          visible: ["SUPER_ADMIN"] },
      { icon: "/setting.png", label: "Schools",    href: "/super-admin/schools",  visible: ["SUPER_ADMIN"] },
      { icon: "/teacher.png", label: "Users",      href: "/super-admin/users",    visible: ["SUPER_ADMIN"] },
      { icon: "/finance.png", label: "Subscriptions", href: "/super-admin/subscriptions", visible: ["SUPER_ADMIN"] },
      { icon: "/result.png",  label: "Analytics",  href: "/super-admin/analytics", visible: ["SUPER_ADMIN"] },
      { icon: "/attendance.png", label: "Monitoring", href: "/super-admin/monitoring", visible: ["SUPER_ADMIN"] },
      { icon: "/message.png", label: "Support",    href: "/super-admin/support",  visible: ["SUPER_ADMIN"] },
      { icon: "/announcement.png", label: "Announcements", href: "/super-admin/announcements", visible: ["SUPER_ADMIN"] },
      { icon: "/profile.png", label: "Audit Logs", href: "/super-admin/audit",    visible: ["SUPER_ADMIN"] },
      // Home links — one per role
      { icon: "/home.png",         label: "Home",          href: "/provider",            visible: ["provider"] },
      { icon: "/home.png",         label: "Home",          href: "/admin",               visible: ["admin", "SCHOOL_ADMIN"] },
      { icon: "/home.png",         label: "Home",          href: "/teacher",             visible: ["teacher", "TEACHER"] },
      { icon: "/class.png",        label: "My Classroom",  href: "/teacher/classroom",   visible: ["teacher", "TEACHER"] },
      { icon: "/home.png",         label: "Home",          href: "/student",             visible: ["student", "STUDENT"] },
      { icon: "/home.png",         label: "Home",          href: "/parent",              visible: ["PARENT"] },
      // Provider only
      { icon: "/setting.png",      label: "Schools",       href: "/provider/schools",    visible: ["provider"] },
      // Admin + provider
      { icon: "/teacher.png",      label: "Teachers",      href: "/list/teachers",       visible: ["admin", "SCHOOL_ADMIN", "provider"] },
      { icon: "/student.png",      label: "Students",      href: "/list/students",       visible: ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER", "provider"] },
      { icon: "/parent.png",       label: "Parents",       href: "/list/parents",        visible: ["admin", "SCHOOL_ADMIN", "provider"] },
      { icon: "/subject.png",      label: "Subjects",      href: "/list/subjects",       visible: ["admin", "SCHOOL_ADMIN"] },
      { icon: "/class.png",        label: "Classes",       href: "/list/classes",        visible: ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER"] },
      { icon: "/lesson.png",       label: "Lessons",       href: "/list/lessons",        visible: ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER"] },
      // All school roles
      { icon: "/exam.png",         label: "Exams",         href: "/list/exams",          visible: ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER", "student", "STUDENT"] },
      { icon: "/assignment.png",   label: "Assignments",   href: "/list/assignments",    visible: ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER", "student", "STUDENT"] },
      { icon: "/result.png",       label: "Results",       href: "/list/results",        visible: ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER", "student", "STUDENT"] },
      { icon: "/attendance.png",   label: "Attendance",    href: "/list/attendance",     visible: ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER", "student", "STUDENT"] },
      { icon: "/calendar.png",     label: "Events",        href: "/list/events",         visible: ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER", "student", "STUDENT"] },
      { icon: "/message.png",      label: "Messages",      href: "/list/messages",       visible: ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER", "student", "STUDENT"] },
      { icon: "/announcement.png", label: "Announcements", href: "/list/announcements",  visible: ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER", "student", "STUDENT"] },
    ],
  },
  {
    title: "OTHER",
    items: [
      { icon: "/setting.png",  label: "Settings",      href: "/super-admin/settings", visible: ["SUPER_ADMIN"] },
      { icon: "/profile.png",  label: "Profile",       href: "/profile",   visible: ["admin", "SCHOOL_ADMIN", "teacher", "TEACHER", "student", "STUDENT"] },
      { icon: "/setting.png",  label: "Settings",      href: "/settings",  visible: ["admin", "SCHOOL_ADMIN"] },
      { icon: "/logout.png",   label: "Logout",        href: "/logout",    visible: ["SUPER_ADMIN", "provider", "admin", "SCHOOL_ADMIN", "teacher", "TEACHER", "student", "STUDENT", "PARENT"] },
    ],
  },
];

const Menu = async () => {
  const role = await getRole();
  if (!role) return null;

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {section.title}
          </span>
          {section.items.map((item) => {
            if (!item.visible.includes(role)) return null;
            return (
              <Link
                href={item.href}
                key={item.label + item.href}
                className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
              >
                <Image src={item.icon} alt="" width={20} height={20} />
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
