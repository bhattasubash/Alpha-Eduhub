"use client";

import Link from "next/link";
import { CheckCircle2, XCircle, Clock, AlertTriangle, List } from "lucide-react";
import { useState } from "react";

interface School {
  id:               string;
  name:             string;
  status:           string;
  createdAt:        Date;
  subscriptionPlan: string;
  _count: { students: number; teachers: number };
}

interface Props {
  schools: School[];
  allSchools?: School[];
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; icon: React.ReactNode }> = {
    ACTIVE:    { cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: <CheckCircle2 className="w-3 h-3" /> },
    SUSPENDED: { cls: "text-red-400 bg-red-500/10 border-red-500/20",             icon: <XCircle className="w-3 h-3" /> },
    TRIAL:     { cls: "text-amber-400 bg-amber-500/10 border-amber-500/20",       icon: <Clock className="w-3 h-3" /> },
    INACTIVE:  { cls: "text-white/40 bg-white/5 border-white/10",                 icon: <AlertTriangle className="w-3 h-3" /> },
  };
  const s = map[status] ?? map["INACTIVE"];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium ${s.cls}`}>
      {s.icon}{status}
    </span>
  );
}

export default function RecentSchoolsTable({ schools, allSchools }: Props) {
  const [showAll, setShowAll] = useState(false);
  
  const displaySchools = showAll && allSchools ? allSchools : schools;

  if (displaySchools.length === 0) {
    return (
      <div className="text-center py-8 text-white/30 text-sm">
        No schools registered yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {allSchools && allSchools.length > schools.length && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-400 text-xs font-medium transition-all"
        >
          <List className="w-3.5 h-3.5" />
          {showAll ? `Show Recent (${schools.length})` : `Show All (${allSchools.length})`}
        </button>
      )}
      {displaySchools.map((school) => (
        <Link
          key={school.id}
          href={`/super-admin/schools/${school.id}`}
          className="flex items-center justify-between p-3 rounded-xl bg-white/3 hover:bg-white/6 border border-white/5 hover:border-white/10 transition-all group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600/30 to-indigo-600/20 flex items-center justify-center flex-shrink-0">
              <span className="text-purple-300 text-xs font-bold">
                {school.name.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white/80 text-sm font-medium truncate group-hover:text-white transition-colors">
                {school.name}
              </p>
              <p className="text-white/30 text-xs">
                {school._count.students} students · {school._count.teachers} teachers
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <StatusBadge status={school.status} />
          </div>
        </Link>
      ))}
    </div>
  );
}
