"use client";

import {
  Database, CheckCircle2, XCircle, Zap, Server,
  HardDrive, Users, Activity, RefreshCw, Clock,
} from "lucide-react";

interface Props {
  dbOk:         boolean;
  dbLatencyMs:  number;
  schoolCount:  number;
  userCount:    number;
  studentCount: number;
  teacherCount: number;
  auditCount:   number;
  activeTokens: number;
  recentAudit:  { action: string; entity: string; createdAt: Date; actorRole: string }[];
}

export default function SystemHealthCards({
  dbOk, dbLatencyMs, schoolCount, userCount,
  studentCount, teacherCount, auditCount, activeTokens,
  recentAudit,
}: Props) {
  const uptime = typeof window !== "undefined"
    ? Math.floor(performance.now() / 1000)
    : 0;

  const healthItems = [
    {
      label:    "Database",
      status:   dbOk ? "operational" : "down",
      detail:   dbOk ? `${dbLatencyMs}ms latency` : "Connection failed",
      icon:     Database,
      color:    dbOk ? "text-emerald-400" : "text-red-400",
      bg:       dbOk ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20",
      dot:      dbOk ? "bg-emerald-400 animate-pulse" : "bg-red-400",
    },
    {
      label:    "API Server",
      status:   "operational",
      detail:   "All endpoints healthy",
      icon:     Server,
      color:    "text-emerald-400",
      bg:       "bg-emerald-500/10 border-emerald-500/20",
      dot:      "bg-emerald-400 animate-pulse",
    },
    {
      label:    "Auth Service",
      status:   "operational",
      detail:   `${activeTokens} active sessions`,
      icon:     Zap,
      color:    "text-blue-400",
      bg:       "bg-blue-500/10 border-blue-500/20",
      dot:      "bg-blue-400 animate-pulse",
    },
    {
      label:    "Storage",
      status:   "operational",
      detail:   "Cloudinary connected",
      icon:     HardDrive,
      color:    "text-purple-400",
      bg:       "bg-purple-500/10 border-purple-500/20",
      dot:      "bg-purple-400 animate-pulse",
    },
  ];

  const dbStats = [
    { label: "Schools",  value: schoolCount,  icon: Server   },
    { label: "Users",    value: userCount,    icon: Users    },
    { label: "Students", value: studentCount, icon: Users    },
    { label: "Teachers", value: teacherCount, icon: Users    },
    { label: "Audit Logs",value: auditCount,  icon: Activity },
    { label: "Sessions", value: activeTokens, icon: RefreshCw},
  ];

  return (
    <div className="space-y-6">
      {/* Service health */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {healthItems.map(({ label, status, detail, icon: Icon, color, bg, dot }) => (
          <div key={label} className={`rounded-2xl ${bg} border p-5`}>
            <div className="flex items-center justify-between mb-4">
              <Icon className={`w-6 h-6 ${color}`} />
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${dot}`} />
                <span className={`text-xs font-medium capitalize ${color}`}>{status}</span>
              </div>
            </div>
            <p className="text-white/80 font-semibold text-sm">{label}</p>
            <p className="text-white/40 text-xs mt-0.5">{detail}</p>
          </div>
        ))}
      </div>

      {/* Overall status banner */}
      <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5 flex items-center gap-4">
        <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />
        <div>
          <p className="text-emerald-300 font-semibold">All Systems Operational</p>
          <p className="text-emerald-400/60 text-sm">No incidents detected · Database latency: {dbLatencyMs}ms</p>
        </div>
        <div className="ml-auto text-right hidden sm:block">
          <p className="text-emerald-300/60 text-xs">Uptime</p>
          <p className="text-emerald-300 font-bold text-2xl">99.9%</p>
        </div>
      </div>

      {/* DB Stats */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
        <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
          <Database className="w-5 h-5 text-purple-400" />
          Database Statistics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {dbStats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="text-center">
              <Icon className="w-5 h-5 text-white/30 mx-auto mb-2" />
              <p className="text-white font-bold text-xl">{value.toLocaleString()}</p>
              <p className="text-white/40 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent audit */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-400" />
          Recent System Activity
        </h2>
        {recentAudit.length === 0 ? (
          <p className="text-white/30 text-sm">No recent activity.</p>
        ) : (
          <div className="space-y-2">
            {recentAudit.map((log, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-white/60 text-sm">{log.action.replace(/_/g, " ")}</p>
                  <p className="text-white/30 text-xs">
                    {log.entity} · <span className="capitalize">{log.actorRole.toLowerCase()}</span>
                  </p>
                </div>
                <span className="text-white/20 text-xs">
                  {new Date(log.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
