"use client";

import { useState, useTransition } from "react";
import { Building2, ChevronDown, Check, Globe } from "lucide-react";
import { switchSchoolContext } from "@/lib/superAdminActions";

interface SchoolOption {
  id: string;
  name: string;
}

interface Props {
  schools: SchoolOption[];
  activeSchoolId?: string | null;
}

export default function SchoolContextSwitcher({ schools, activeSchoolId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const activeSchool = schools.find((s) => s.id === activeSchoolId);

  const handleSelect = (schoolId: string | null) => {
    setIsOpen(false);
    startTransition(async () => {
      const formData = new FormData();
      if (schoolId) formData.append("schoolId", schoolId);
      await switchSchoolContext({ success: false, error: false }, formData);
      window.location.reload();
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:bg-purple-500/20 text-xs font-medium transition-all"
      >
        <Building2 className="w-3.5 h-3.5 text-purple-400" />
        <span className="max-w-[140px] truncate">
          {activeSchool ? activeSchool.name : "All Schools Context"}
        </span>
        <ChevronDown className="w-3 h-3 text-purple-400/60" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#14142b] border border-white/10 shadow-2xl p-1.5 z-50 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-semibold text-white/40 uppercase tracking-wider">
              Switch Target Context
            </div>

            <button
              onClick={() => handleSelect(null)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                !activeSchoolId
                  ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-purple-400" />
                <span>All Schools (Global)</span>
              </div>
              {!activeSchoolId && <Check className="w-3.5 h-3.5 text-purple-400" />}
            </button>

            <div className="my-1 border-t border-white/5" />

            <div className="max-h-48 overflow-y-auto space-y-0.5">
              {schools.map((school) => {
                const isSelected = school.id === activeSchoolId;
                return (
                  <button
                    key={school.id}
                    onClick={() => handleSelect(school.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Building2 className="w-3.5 h-3.5 text-white/40 shrink-0" />
                      <span className="truncate">{school.name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
