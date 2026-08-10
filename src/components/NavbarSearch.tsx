"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

/** Tries to figure out which list page is currently active from the path. */
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

    // If we're already on a list page, search within it; otherwise go to students
    const current = detectCurrentList(window.location.pathname);
    const target  = current ?? "/list/students";

    const params = new URLSearchParams(window.location.search);
    params.set("search", trimmed);
    params.delete("page");
    router.push(`${target}?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2"
    >
      <Image src="/search.png" alt="search" width={14} height={14} />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="w-[200px] p-2 bg-transparent outline-none"
      />
    </form>
  );
};

export default NavbarSearch;
