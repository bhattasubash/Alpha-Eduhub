import Link from "next/link";
import { getSession, getCurrentSchoolId } from "@/lib/getRole";
import NavbarSearch from "./NavbarSearch";
import LogoutButton from "./LogoutButton";
import prisma from "@/lib/prisma";
import { Bell, MessageSquare, ShieldCheck } from "lucide-react";

const Navbar = async () => {
  const session  = await getSession();
  const schoolId = await getCurrentSchoolId();

  const displayName = session?.username ?? "User";
  const roleLabel   = session ? session.role.replace(/_/g, " ") : "";

  // Live announcement count badge
  let announcementCount = 0;
  try {
    announcementCount = await prisma.announcement.count({
      where: {
        date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        ...(schoolId ? { schoolId } : {}),
      },
    });
  } catch { /* ignore */ }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-3.5 bg-white/95 backdrop-blur-xs border-b border-slate-200/80">
      <NavbarSearch />

      <div className="flex items-center gap-3 md:gap-4 justify-end">
        {/* Messages Shortcut */}
        <Link
          href="/list/messages"
          title="Messages"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200/60"
        >
          <MessageSquare className="w-4 h-4" strokeWidth={1.75} />
        </Link>

        {/* Announcements Notification */}
        <Link
          href="/list/announcements"
          title="Announcements"
          className="relative w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200/60"
        >
          <Bell className="w-4 h-4" strokeWidth={1.75} />
          {announcementCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 flex items-center justify-center bg-blue-600 text-white rounded-full text-[10px] font-bold">
              {announcementCount > 9 ? "9+" : announcementCount}
            </span>
          )}
        </Link>

        <div className="h-5 w-px bg-slate-200 mx-1" />

        {/* User profile capsule */}
        <div className="flex items-center gap-3 pl-1">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
            {displayName.slice(0, 2).toUpperCase()}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-800 leading-tight">
              {displayName}
            </span>
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">
              {roleLabel}
            </span>
          </div>
        </div>

        <LogoutButton />
      </div>
    </header>
  );
};

export default Navbar;
