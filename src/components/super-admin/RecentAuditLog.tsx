"use client";

import { useState } from "react";
import { formatDistanceToNow } from "@/lib/utils";
import {
  PlusCircle, Trash2, Edit, Power, PowerOff, ShieldCheck,
  LogIn, KeyRound, AlertCircle, Eye, X, Globe, Laptop, Clock, User, Building2,
} from "lucide-react";

interface AuditLog {
  id:        string;
  action:    string;
  entity:    string;
  entityId:  string | null;
  actorId:   string;
  actorRole: string;
  actorEmail:string | null;
  createdAt: Date;
  schoolId:  string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?:  any;
}

interface Props {
  logs: AuditLog[];
}

function actionIcon(action: string) {
  if (action.startsWith("CREATE"))   return <PlusCircle  className="w-4 h-4 text-emerald-400" />;
  if (action.startsWith("DELETE"))   return <Trash2      className="w-4 h-4 text-red-400"     />;
  if (action.startsWith("UPDATE") || action.startsWith("EDIT")) return <Edit className="w-4 h-4 text-blue-400" />;
  if (action.startsWith("SUSPEND"))  return <PowerOff    className="w-4 h-4 text-amber-400"   />;
  if (action.startsWith("ACTIVATE")) return <Power       className="w-4 h-4 text-emerald-400" />;
  if (action === "FORCE_LOGOUT")     return <LogIn       className="w-4 h-4 text-orange-400"  />;
  if (action === "RESET_PASSWORD")   return <KeyRound    className="w-4 h-4 text-purple-400"  />;
  if (action.includes("IMPERSONATE") || action.includes("ADMIN")) return <ShieldCheck className="w-4 h-4 text-purple-400" />;
  return <AlertCircle className="w-4 h-4 text-white/40" />;
}

function actionLabel(action: string): string {
  return action.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function RecentAuditLog({ logs }: Props) {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-white/30 text-sm">
        No audit events recorded yet.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {logs.map((log) => (
          <div
            key={log.id}
            onClick={() => setSelectedLog(log)}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all border border-transparent hover:border-white/10 group"
          >
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
              {actionIcon(log.action)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-white/80 text-sm font-medium">
                  {actionLabel(log.action)}
                  {log.entity && (
                    <span className="text-white/40 font-normal"> · {log.entity}</span>
                  )}
                </p>
              </div>
              <p className="text-white/40 text-xs mt-0.5">
                by {log.actorEmail ?? log.actorId.slice(0, 8)}
                {" · "}
                <span className="capitalize">{log.actorRole.toLowerCase()}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/30 text-[11px]">
                {formatDistanceToNow(log.createdAt)}
              </span>
              <Eye className="w-3.5 h-3.5 text-white/20 group-hover:text-purple-400 transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* Audit Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-[#121225] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                  {actionIcon(selectedLog.action)}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-base">
                    Audit Event Details
                  </h3>
                  <p className="text-purple-400 text-xs font-mono">ID: {selectedLog.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-white/40 text-[10px] uppercase font-semibold">
                    <User className="w-3 h-3 text-purple-400" /> User / Actor
                  </div>
                  <p className="text-white font-medium">{selectedLog.actorEmail || selectedLog.actorId}</p>
                  <p className="text-white/40">Role: <span className="capitalize text-white/70">{selectedLog.actorRole}</span></p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-white/40 text-[10px] uppercase font-semibold">
                    <Clock className="w-3 h-3 text-purple-400" /> Timestamp
                  </div>
                  <p className="text-white font-medium">{new Date(selectedLog.createdAt).toLocaleString()}</p>
                  <p className="text-white/40">{formatDistanceToNow(selectedLog.createdAt)}</p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-white/40 text-[10px] uppercase font-semibold">
                    <Globe className="w-3 h-3 text-purple-400" /> IP Address
                  </div>
                  <p className="text-white font-mono font-medium">{selectedLog.ipAddress || selectedLog.metadata?.ipAddress || "127.0.0.1"}</p>
                  <p className="text-white/40">Network origin</p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-white/40 text-[10px] uppercase font-semibold">
                    <Building2 className="w-3 h-3 text-purple-400" /> School Scope
                  </div>
                  <p className="text-white font-medium">{selectedLog.schoolId || "Global (Platform Owner)"}</p>
                  <p className="text-white/40">Target Tenant ID</p>
                </div>
              </div>

              {/* Device Telemetry */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-white/40 text-[10px] uppercase font-semibold">
                  <Laptop className="w-3 h-3 text-purple-400" /> Device Information (User Agent)
                </div>
                <p className="text-white/80 font-mono text-[11px] break-all">
                  {selectedLog.userAgent || selectedLog.metadata?.userAgent || "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
                </p>
              </div>

              {/* Action Details */}
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-1">
                <div className="text-purple-300 text-[10px] uppercase font-semibold">Action Executed</div>
                <p className="text-white text-sm font-bold">{selectedLog.action} <span className="text-white/40 font-normal">on {selectedLog.entity}</span></p>
              </div>

              {/* Previous Value vs New Value Diff */}
              {selectedLog.metadata && (selectedLog.metadata.previousValue || selectedLog.metadata.newValue) && (
                <div className="space-y-3">
                  <h4 className="text-white font-semibold text-xs uppercase tracking-wider text-white/60">
                    State Change Diff (Audit Trail)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 space-y-1.5">
                      <p className="text-red-400 font-semibold text-[10px] uppercase">Previous Value</p>
                      <pre className="text-red-200 font-mono text-[10px] whitespace-pre-wrap overflow-x-auto">
                        {JSON.stringify(selectedLog.metadata.previousValue, null, 2)}
                      </pre>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
                      <p className="text-emerald-400 font-semibold text-[10px] uppercase">New Value</p>
                      <pre className="text-emerald-200 font-mono text-[10px] whitespace-pre-wrap overflow-x-auto">
                        {JSON.stringify(selectedLog.metadata.newValue, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* Full Raw Metadata */}
              <div className="space-y-2">
                <h4 className="text-white/60 font-semibold text-xs uppercase tracking-wider">
                  Raw Event Payload
                </h4>
                <pre className="p-3 rounded-xl bg-black/40 border border-white/10 text-purple-300 font-mono text-[10px] overflow-x-auto max-h-40">
                  {JSON.stringify(selectedLog.metadata || {}, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

