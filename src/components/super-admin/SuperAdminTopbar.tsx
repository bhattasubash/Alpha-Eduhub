"use client";

import { Bell, Search, Shield, ChevronDown, Moon, Sun } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import SchoolContextSwitcher from "./SchoolContextSwitcher";

interface SchoolOption {
  id: string;
  name: string;
}

interface Props {
  username: string;
  schools?: SchoolOption[];
  activeSchoolId?: string | null;
}

export default function SuperAdminTopbar({ username, schools = [], activeSchoolId }: Props) {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <header className="h-16 border-b border-white/5 bg-[#0d0d1a]/80 backdrop-blur-xl flex items-center gap-4 px-4 md:px-6 sticky top-0 z-10">
      {/* Search */}
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search schools, users, tickets…"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* School Context Switcher for Super Admin */}
        {schools.length > 0 && (
          <SchoolContextSwitcher schools={schools} activeSchoolId={activeSchoolId} />
        )}

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-all"
          aria-label="Toggle theme"
        >
          {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <Link href="/super-admin/support" className="relative w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-600 text-white text-[9px] font-bold flex items-center justify-center">
            3
          </span>
        </Link>

        {/* User menu */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div className="hidden md:block">
            <p className="text-white/90 text-xs font-semibold leading-tight">{username}</p>
            <p className="text-purple-400 text-[10px] leading-tight">Super Admin</p>
          </div>
          <ChevronDown className="w-3 h-3 text-white/30 hidden md:block" />
        </div>
      </div>
    </header>
  );
}

