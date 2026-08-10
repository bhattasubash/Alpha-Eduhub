"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Filter, X, Check, RotateCcw } from "lucide-react";
import Image from "next/image";

interface SubjectOption {
  id: number;
  name: string;
}

interface ClassOption {
  id: number;
  name: string;
}

export default function TeacherFilterModal({
  subjects = [],
  classes = [],
}: {
  subjects: SubjectOption[];
  classes: ClassOption[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);

  const currentSubject = searchParams.get("subject") || "";
  const currentClass = searchParams.get("class") || "";

  const [selectedSubject, setSelectedSubject] = useState(currentSubject);
  const [selectedClass, setSelectedClass] = useState(currentClass);

  useEffect(() => {
    setSelectedSubject(searchParams.get("subject") || "");
    setSelectedClass(searchParams.get("class") || "");
  }, [searchParams]);

  const activeFilterCount = [selectedSubject, selectedClass].filter(Boolean).length;

  const applyFilters = (sbj: string, cls: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (sbj) params.set("subject", sbj);
    else params.delete("subject");

    if (cls) params.set("class", cls);
    else params.delete("class");

    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleApply = () => {
    applyFilters(selectedSubject, selectedClass);
    setIsOpen(false);
  };

  const handleReset = () => {
    setSelectedSubject("");
    setSelectedClass("");
    applyFilters("", "");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-10 h-10 flex items-center justify-center rounded-full transition-colors shadow-sm ${
          activeFilterCount > 0
            ? "bg-amber-400 text-amber-950 font-bold ring-2 ring-amber-500"
            : "bg-lamaYellow hover:bg-yellow-400"
        }`}
        title="Filter Teachers"
      >
        <Image src="/filter.png" alt="Filter" width={16} height={16} />
        {activeFilterCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-extrabold shadow">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Popover */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 z-50 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-gray-800 text-sm">Filter Teachers</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter 1: Subject */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              >
                <option value="">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter 2: Class */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                Class / Section
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              >
                <option value="">All Classes</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.name}>
                    Class {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-1">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
