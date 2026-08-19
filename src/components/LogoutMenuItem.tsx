"use client";

import Image from "next/image";

interface LogoutMenuItemProps {
  icon: string;
  label: string;
}

export default function LogoutMenuItem({ icon, label }: LogoutMenuItemProps) {
  const handleLogout = () => {
    fetch("/api/auth/logout", { method: "POST", credentials: "include" })
      .catch(() => console.log("Logout failed"));
    window.location.href = "/sign-in";
  };

  return (
    <div
      className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight cursor-pointer"
      onClick={handleLogout}
    >
      <Image src={icon} alt="" width={20} height={20} />
      <span className="hidden lg:block">{label}</span>
    </div>
  );
}