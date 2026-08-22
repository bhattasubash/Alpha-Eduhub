import { getSession } from "@/lib/getRole";
import { redirect } from "next/navigation";
import Image from "next/image";

export const dynamic = 'force-dynamic';

const ProfilePage = async () => {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const roleLabel = session.role.charAt(0).toUpperCase() + session.role.slice(1);

  return (
    <div className="p-4 flex-1 flex flex-col gap-4">
      <div className="bg-white p-6 rounded-md shadow-sm">
        <h1 className="text-xl font-semibold mb-4">{roleLabel} Profile</h1>
        <div className="flex items-center gap-6">
          <Image
            src="/noAvatar.png"
            alt="Profile Avatar"
            width={80}
            height={80}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold">{session.username}</h2>
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full w-fit mt-1">
              Role: {roleLabel}
            </span>
            {session.schoolId && (
              <span className="text-xs text-gray-400">
                School ID: {session.schoolId}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
