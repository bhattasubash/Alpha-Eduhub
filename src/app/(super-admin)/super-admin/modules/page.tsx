import { redirect } from "next/navigation";
import { Blocks, Search, ToggleLeft, ToggleRight, Server, BookOpen, Bus, MessageSquare } from "lucide-react";
import { requireSession } from "@/lib/getRole";

const modules = [
  { id: "transport", name: "Transport Management", description: "Manage school buses, routes, and drivers.", icon: Bus, enabled: true },
  { id: "library", name: "Library System", description: "Track books, issue logs, and inventory.", icon: BookOpen, enabled: true },
  { id: "messaging", name: "Internal Messaging", description: "Allow users to chat internally.", icon: MessageSquare, enabled: false },
  { id: "hostel", name: "Hostel Management", description: "Manage rooms, beds, and students residing in the hostel.", icon: Server, enabled: false },
];

export default async function ModulesPage() {
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
            <Blocks className="w-6 h-6 text-purple-400" />
            Global Modules
          </h1>
          <p className="text-white/40 text-sm mt-1">Enable or disable features across all schools</p>
        </div>
        
        <div className="relative">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search modules..."
            className="w-full md:w-64 bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <div key={mod.id} className={`p-5 rounded-2xl border transition-all ${mod.enabled ? 'bg-white/5 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]' : 'bg-black/20 border-white/5 opacity-70 hover:opacity-100'}`}>
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${mod.enabled ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-white/40'}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <button className={`p-1 transition-colors ${mod.enabled ? 'text-purple-400 hover:text-purple-300' : 'text-white/20 hover:text-white/40'}`}>
                  {mod.enabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                </button>
              </div>
              <div className="mt-4">
                <h3 className={`font-semibold ${mod.enabled ? 'text-white' : 'text-white/70'}`}>{mod.name}</h3>
                <p className="text-white/40 text-xs mt-1 leading-relaxed">{mod.description}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-medium">
                <span className={mod.enabled ? 'text-emerald-400' : 'text-white/30'}>
                  {mod.enabled ? 'Active Globally' : 'Disabled'}
                </span>
                {mod.enabled && (
                  <span className="text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                    Premium Tier
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
