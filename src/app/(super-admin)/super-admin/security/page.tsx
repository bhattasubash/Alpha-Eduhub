import { redirect } from "next/navigation";
import { ShieldCheck, Lock, Globe, KeyRound, AlertTriangle, Fingerprint, Save } from "lucide-react";
import { requireSession } from "@/lib/getRole";

export const dynamic = 'force-dynamic';

export default async function SecurityPage() {
  let session;
  try {
    session = await requireSession(["SUPER_ADMIN"]);
  } catch {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-red-400" />
            Security Settings
          </h1>
          <p className="text-white/40 text-sm mt-1">Configure global security policies and access controls</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-red-500/25">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="space-y-6">
        {/* Password Policy */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <KeyRound className="w-5 h-5 text-white/70" />
            <h2 className="text-lg font-semibold text-white">Password Policy</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Minimum Password Length</label>
              <input type="number" defaultValue={8} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-red-500/50" />
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-white/20 bg-black/20 text-red-500 focus:ring-red-500/50 focus:ring-offset-0" />
                <span className="text-sm text-white/80">Require special characters (!@#$%^&*)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-white/20 bg-black/20 text-red-500 focus:ring-red-500/50 focus:ring-offset-0" />
                <span className="text-sm text-white/80">Require numbers (0-9)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-white/20 bg-black/20 text-red-500 focus:ring-red-500/50 focus:ring-offset-0" />
                <span className="text-sm text-white/80">Require uppercase letters (A-Z)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Access Control */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <Globe className="w-5 h-5 text-white/70" />
            <h2 className="text-lg font-semibold text-white">Access Control</h2>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Allowed IP Addresses (Super Admins only)</label>
              <p className="text-xs text-white/40 mb-2">Leave blank to allow access from anywhere. Separate IPs by comma.</p>
              <textarea 
                rows={3} 
                placeholder="e.g. 192.168.1.1, 10.0.0.1" 
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50"
              />
            </div>
            
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-400">Strict IP Binding</h4>
                <p className="text-xs text-amber-400/70 mt-1">Enabling this will immediately log out any super admin whose IP is not in the allowed list above, including yourself if your IP is excluded.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Session Management */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <Fingerprint className="w-5 h-5 text-white/70" />
            <h2 className="text-lg font-semibold text-white">Session Management</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Session Timeout (Minutes)</label>
              <input type="number" defaultValue={120} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-red-500/50" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Maximum Concurrent Sessions</label>
              <select className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-red-500/50">
                <option value="1">1 (Single device only)</option>
                <option value="3">3 Devices</option>
                <option value="5">5 Devices</option>
                <option value="unlimited">Unlimited</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
