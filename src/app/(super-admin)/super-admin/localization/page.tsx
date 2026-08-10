import { redirect } from "next/navigation";
import { Globe, Plus, Save, Languages, CheckCircle2 } from "lucide-react";
import { requireSession } from "@/lib/getRole";

const LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", enabled: true, progress: 100 },
  { code: "es", name: "Spanish", nativeName: "Español", enabled: true, progress: 85 },
  { code: "fr", name: "French", nativeName: "Français", enabled: false, progress: 60 },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", enabled: true, progress: 95 },
  { code: "ar", name: "Arabic", nativeName: "العربية", enabled: false, progress: 40 },
];

export default async function LocalizationPage() {
  let session;
  try {
    session = await requireSession(["SUPER_ADMIN"]);
  } catch {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-cyan-400" />
            Localization & Languages
          </h1>
          <p className="text-white/40 text-sm mt-1">Manage platform translations and regional settings</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-all">
            <Plus className="w-4 h-4" />
            Add Language
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-cyan-500/25">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <Languages className="w-5 h-5 text-white/70" />
          <h2 className="text-lg font-semibold text-white">Supported Languages</h2>
        </div>
        
        <div className="divide-y divide-white/5">
          {LANGUAGES.map((lang) => (
            <div key={lang.code} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={lang.enabled} className="sr-only peer" />
                  <div className="w-11 h-6 bg-black/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`font-semibold ${lang.enabled ? 'text-white' : 'text-white/50'}`}>{lang.name}</h3>
                    <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded border border-white/10 uppercase">{lang.code}</span>
                  </div>
                  <p className="text-white/40 text-sm mt-0.5">{lang.nativeName}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-2 text-sm text-white/70 w-full sm:w-48">
                  <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${lang.progress === 100 ? 'bg-emerald-500' : 'bg-cyan-500'}`} 
                      style={{ width: `${lang.progress}%` }}
                    />
                  </div>
                  <span className="w-10 text-right">{lang.progress}%</span>
                </div>
                {lang.progress === 100 ? (
                  <span className="text-emerald-400 text-xs flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Fully Translated
                  </span>
                ) : (
                  <span className="text-cyan-400 text-xs font-medium cursor-pointer hover:underline">
                    Manage Translations
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
