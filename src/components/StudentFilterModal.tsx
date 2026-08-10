"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Filter, X, Check, RotateCcw } from "lucide-react";
import Image from "next/image";

interface ClassOption {
  id: number;
  name: string;
}

interface GradeOption {
  id: number;
  level: number;
}

export default function StudentFilterModal({
  classes = [],
  grades = [],
}: {
  classes: ClassOption[];
  grades: GradeOption[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);

  const currentClass = searchParams.get("class") || "";
  const currentGrade = searchParams.get("grade") || "";
  const currentSex = searchParams.get("sex") || "";

  const [selectedClass, setSelectedClass] = useState(currentClass);
  const [selectedGrade, setSelectedGrade] = useState(currentGrade);
  const [selectedSex, setSelectedSex] = useState(currentSex);

  useEffect(() => {
    setSelectedClass(searchParams.get("class") || "");
    setSelectedGrade(searchParams.get("grade") || "");
    setSelectedSex(searchParams.get("sex") || "");
  }, [searchParams]);

  const activeFilterCount = [selectedClass, selectedGrade, selectedSex].filter(Boolean).length;

  const applyFilters = (cls: string, grd: string, sx: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (cls) params.set("class", cls);
    else params.delete("class");

    if (grd) params.set("grade", grd);
    else params.delete("grade");

    if (sx) params.set("sex", sx);
    else params.delete("sex");

    params.set("page", "1"); // Reset to first page on filter change

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleApply = () => {
    applyFilters(selectedClass, selectedGrade, selectedSex);
    setIsOpen(false);
  };

  const handleReset = () => {
    setSelectedClass("");
    setSelectedGrade("");
    setSelectedSex("");
    applyFilters("", "", "");
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
        title="Filter Students"
      >
        <Image src="/filter.png" alt="Filter" width={16} height={16} />
        {activeFilterCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-extrabold shadow">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Filter Popover / Dropdown Modal */}
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 z-50 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-gray-800 text-sm">Filter Students</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter 1: Section / Class */}
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

            {/* Filter 2: Grade Level */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                Grade Level
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              >
                <option value="">All Grades</option>
                {grades.map((g) => (
                  <option key={g.id} value={g.id.toString()}>
                    Grade {g.level}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter 3: Gender / Sex */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                Gender / Sex
              </label>
              <select
                value={selectedSex}
                onChange={(e) => setSelectedSex(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              >
                <option value="">All Genders</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            {/* Action Buttons */}
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
