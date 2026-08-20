import { redirect } from "next/navigation";
import { Radio, Plus, Megaphone, Clock, Trash2, Edit } from "lucide-react";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/getRole";

export const dynamic = 'force-dynamic';

export default async function BroadcastsPage() {
  let session;
  try {
    session = await requireSession(["SUPER_ADMIN"]);
  } catch {
    redirect("/sign-in");
  }

  const broadcasts = await prisma.platformAnnouncement.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Radio className="w-6 h-6 text-pink-400" />
            System Broadcasts
          </h1>
          <p className="text-white/40 text-sm mt-1">Send platform-wide alerts and announcements</p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-pink-500/25">
          <Plus className="w-4 h-4" />
          New Broadcast
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {broadcasts.length === 0 && (
          <div className="col-span-1 md:col-span-2 p-12 text-center bg-white/5 border border-white/10 rounded-2xl">
            <Radio className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-1">No Broadcasts Yet</h3>
            <p className="text-white/40 text-sm">Create a broadcast to notify all platform users.</p>
          </div>
        )}
        {broadcasts.map((b) => (
          <div key={b.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors group">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${b.type === 'WARNING' ? 'bg-amber-500/20 text-amber-400' : 'bg-pink-500/20 text-pink-400'}`}>
                  <Megaphone className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-white">{b.title}</h3>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                <button className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <p className="text-white/60 text-sm line-clamp-2 mb-4">{b.content}</p>
            <div className="flex items-center justify-between text-xs font-medium border-t border-white/5 pt-4">
              <div className="flex items-center gap-1.5 text-white/40">
                <Clock className="w-3.5 h-3.5" />
                {new Date(b.createdAt).toLocaleDateString()}
              </div>
              <span className={`px-2 py-0.5 rounded-full ${b.targetAll ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'} border`}>
                {b.targetAll ? 'All Users' : 'Specific Roles'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
