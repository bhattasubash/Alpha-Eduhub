"use client";

import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";

export default function SchoolSelector({
  schools,
  currentSchoolId,
}: {
  schools: { id: string; name: string }[];
  currentSchoolId: string;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
        <Building2 className="w-5 h-5 text-purple-400" />
      </div>
      <div className="flex-1 max-w-sm relative">
        <select
          value={currentSchoolId}
          onChange={(e) => router.push(`?schoolId=${e.target.value}`)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/80 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/30 cursor-pointer"
        >
          <option value="" className="bg-[#1a1a2e]">Select a School...</option>
          {schools.map((s) => (
            <option key={s.id} value={s.id} className="bg-[#1a1a2e]">
              {s.name}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 text-xs">
          ▼
        </div>
      </div>
    </div>
  );
}
