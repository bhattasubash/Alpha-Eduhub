import { redirect } from "next/navigation";
import { Book, Plus, Search, FileText, FolderOpen, Edit, Trash2, Eye } from "lucide-react";
import { requireSession } from "@/lib/getRole";

export const dynamic = 'force-dynamic';

const MOCK_ARTICLES = [
  { id: "1", title: "Getting Started for School Admins", category: "Onboarding", status: "PUBLISHED", views: 1245, lastUpdated: new Date(Date.now() - 86400000 * 2) },
  { id: "2", title: "How to Configure Payment Gateways", category: "Billing", status: "DRAFT", views: 0, lastUpdated: new Date(Date.now() - 86400000 * 1) },
  { id: "3", title: "Managing Teacher Leaves", category: "HR", status: "PUBLISHED", views: 856, lastUpdated: new Date(Date.now() - 86400000 * 15) },
  { id: "4", title: "Generating Term Reports", category: "Academics", status: "PUBLISHED", views: 3200, lastUpdated: new Date(Date.now() - 86400000 * 45) },
];

export default async function KnowledgeBasePage() {
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
            <Book className="w-6 h-6 text-orange-400" />
            Knowledge Base
          </h1>
          <p className="text-white/40 text-sm mt-1">Manage help articles and support documentation for school admins</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full md:w-64 bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-orange-500/25 whitespace-nowrap">
            <Plus className="w-4 h-4" />
            New Article
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <h3 className="text-white font-semibold mb-4 px-2">Categories</h3>
          {["All Articles", "Onboarding", "Billing", "HR", "Academics", "System Settings"].map((cat, i) => (
            <button 
              key={cat} 
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${i === 0 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'}`}
            >
              <FolderOpen className={`w-4 h-4 ${i === 0 ? 'text-orange-400' : 'text-white/40'}`} />
              {cat}
            </button>
          ))}
        </div>

        {/* Articles List */}
        <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-white/30 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Article Title</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Views</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_ARTICLES.map((article) => (
                  <tr key={article.id} className="hover:bg-white/3 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-white/40 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-white/90 group-hover:text-orange-400 transition-colors cursor-pointer">{article.title}</p>
                          <p className="text-xs text-white/40 mt-0.5">Updated {article.lastUpdated.toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/60 text-xs font-medium">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {article.status === "PUBLISHED" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-emerald-400 text-xs font-medium">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-white/40 text-xs font-medium bg-black/30">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-white/60 text-sm">
                        <Eye className="w-4 h-4 text-white/30" />
                        {article.views.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-red-500/10 text-white/60 hover:text-red-400 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
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
    </div>
  );
}
