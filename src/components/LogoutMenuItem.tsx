"use client";

import { LogOut } from "lucide-react";

interface LogoutMenuItemProps {
  icon?: string;
  label: string;
}

export default function LogoutMenuItem({ label }: LogoutMenuItemProps) {
  const handleLogout = () => {
    fetch("/api/auth/logout", { method: "POST", credentials: "include" })
      .catch(() => console.log("Logout failed"));
    window.location.href = "/sign-in";
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center justify-center lg:justify-start gap-3 text-slate-500 hover:text-rose-600 hover:bg-rose-50/80 py-2 px-2.5 rounded-lg transition-colors group cursor-pointer text-left text-xs font-medium"
    >
      <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-colors shrink-0" strokeWidth={1.75} />
      <span className="hidden lg:block">{label}</span>
    </button>
  );
}