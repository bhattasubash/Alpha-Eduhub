"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

const SEARCH_PAGES = [
  "/list/teachers",
  "/list/students",
  "/list/parents",
  "/list/subjects",
  "/list/classes",
  "/list/lessons",
  "/list/exams",
  "/list/assignments",
  "/list/results",
  "/list/attendance",
  "/list/events",
  "/list/announcements",
];

function detectCurrentList(pathname: string): string | null {
  return SEARCH_PAGES.find((p) => pathname.startsWith(p)) ?? null;
}

const NavbarSearch = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    const current = detectCurrentList(window.location.pathname);
    const target = current ?? "/list/students";

    const params = new URLSearchParams(window.location.search);
    params.set("search", trimmed);
    params.delete("page");
    router.push(`${target}?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="hidden md:flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100/80 focus-within:bg-white text-slate-700 text-xs rounded-lg border border-slate-200/90 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all px-3 py-1.5 w-64 lg:w-80"
    >
      <Search className="w-4 h-4 text-slate-400 shrink-0" strokeWidth={1.75} />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Quick search records, students, classes..."
        className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 outline-none text-xs"
      />
      <kbd className="hidden lg:inline-flex items-center gap-0.5 font-mono text-[10px] text-slate-400 bg-white border border-slate-200 rounded px-1.5 py-0.5 shadow-2xs">
        ↵
      </kbd>
    </form>
  );
};

export default NavbarSearch;
