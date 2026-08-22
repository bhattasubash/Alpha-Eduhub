"use client";

import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  showImage?: boolean;
  showLabel?: boolean;
}

export default function LogoutButton({ showImage = true, showLabel = false }: LogoutButtonProps) {
  const handleLogout = () => {
    fetch("/api/auth/logout", { method: "POST", credentials: "include" })
      .catch(() => console.log("Logout failed"));
    window.location.href = "/sign-in";
  };

  return (
    <button 
      onClick={handleLogout} 
      title="Sign out of account"
      className="flex items-center gap-2 p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
    >
      {showImage && <LogOut className="w-4 h-4" strokeWidth={1.75} />}
      {showLabel && <span className="text-xs font-medium">Sign Out</span>}
    </button>
  );
}