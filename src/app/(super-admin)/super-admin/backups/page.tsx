import { redirect } from "next/navigation";
import { HardDrive, Download, RotateCcw, DatabaseBackup, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { requireSession } from "@/lib/getRole";

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

// Mocking backups since Prisma schema might not be pushed yet
const MOCK_BACKUPS = [
  { id: "1", fileName: "backup_prod_20240501.sql.gz", fileSize: 1024 * 1024 * 450, status: "COMPLETED", startedAt: new Date(Date.now() - 86400000 * 1), completedAt: new Date(Date.now() - 86400000 * 1 + 500000), triggeredBy: "SYSTEM" },
  { id: "2", fileName: "backup_prod_20240430.sql.gz", fileSize: 1024 * 1024 * 445, status: "COMPLETED", startedAt: new Date(Date.now() - 86400000 * 2), completedAt: new Date(Date.now() - 86400000 * 2 + 480000), triggeredBy: "SYSTEM" },
  { id: "3", fileName: "manual_backup_pre_deploy.sql.gz", fileSize: 1024 * 1024 * 440, status: "COMPLETED", startedAt: new Date(Date.now() - 86400000 * 3), completedAt: new Date(Date.now() - 86400000 * 3 + 450000), triggeredBy: "admin_user" },
  { id: "4", fileName: "backup_prod_20240428.sql.gz", fileSize: 0, status: "FAILED", startedAt: new Date(Date.now() - 86400000 * 4), completedAt: null, triggeredBy: "SYSTEM" },
];

export default async function BackupsPage() {
  let session;
  try {
    session = await requireSession(["SUPER_ADMIN"]);
  } catch {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <HardDrive className="w-6 h-6 text-blue-400" />
            Database Backups
          </h1>
          <p className="text-white/40 text-sm mt-1">Manage, download, and restore platform data</p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/25">
          <DatabaseBackup className="w-4 h-4" />
          Trigger Manual Backup
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-white/40 text-sm font-medium">Last Successful Backup</p>
            <p className="text-white font-semibold mt-0.5">Today at 03:00 AM</p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <p className="text-white/40 text-sm font-medium">Total Storage Used</p>
            <p className="text-white font-semibold mt-0.5">14.5 GB</p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-white/40 text-sm font-medium">Retention Policy</p>
            <p className="text-white font-semibold mt-0.5">30 Days</p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-white/30 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">File Name</th>
                <th className="px-6 py-4 font-medium">Size</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Created At</th>
                <th className="px-6 py-4 font-medium">Triggered By</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_BACKUPS.map((backup) => (
                <tr key={backup.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-white/90">{backup.fileName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-white/60">
                      {backup.fileSize > 0 ? `${(backup.fileSize / 1024 / 1024).toFixed(2)} MB` : '-'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {backup.status === "COMPLETED" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> COMPLETED
                      </span>
                    ) : backup.status === "FAILED" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                        <AlertTriangle className="w-3.5 h-3.5" /> FAILED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
                        <Clock className="w-3.5 h-3.5" /> PENDING
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-white/60">
                      {backup.startedAt.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60 text-xs font-medium">
                      {backup.triggeredBy}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        disabled={backup.status !== 'COMPLETED'} 
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                        title="Download Backup"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        disabled={backup.status !== 'COMPLETED'} 
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                        title="Restore from Backup"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
