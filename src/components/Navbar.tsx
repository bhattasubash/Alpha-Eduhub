import Image from "next/image";
import Link from "next/link";
import { getSession, getCurrentSchoolId } from "@/lib/getRole";
import NavbarSearch from "./NavbarSearch";
import prisma from "@/lib/prisma";

const Navbar = async () => {
  const session   = await getSession();
  const schoolId  = await getCurrentSchoolId();

  const displayName = session?.username ?? "User";
  const roleLabel   = session ? session.role.charAt(0).toUpperCase() + session.role.slice(1) : "";

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
    <div className="flex items-center justify-between p-4">
      <NavbarSearch />

      <div className="flex items-center gap-6 justify-end w-full">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <Image src="/message.png" alt="messages" width={20} height={20} />
        </div>

        <Link href="/list/announcements" className="relative bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <Image src="/announcement.png" alt="announcements" width={20} height={20} />
          {announcementCount > 0 && (
            <span className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
              {announcementCount > 9 ? "9+" : announcementCount}
            </span>
          )}
        </Link>

        <div className="flex flex-col items-end">
          <span className="text-xs font-medium leading-3">{displayName}</span>
          <span className="text-[10px] text-gray-500 capitalize">{roleLabel}</span>
        </div>

        <Link href="/logout" title="Sign out">
          <Image src="/logout.png" alt="Sign out" width={20} height={20}
            className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
