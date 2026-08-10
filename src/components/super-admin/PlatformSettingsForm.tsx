"use client";

import { useState, useTransition } from "react";
import { Save, Check, Loader2 } from "lucide-react";
import { updatePlatformSetting } from "@/lib/superAdminActions";
import { toast } from "react-toastify";

interface Props {
  settingKey:   string;
  label:        string;
  category:     string;
  currentValue: string;
  inputType:    string;
}

export default function PlatformSettingsForm({
  settingKey, label, category, currentValue, inputType,
}: Props) {
  const [value,     setValue]     = useState(currentValue);
  const [saved,     setSaved]     = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    const fd = new FormData();
    fd.set("key",      settingKey);
    fd.set("value",    value);
    fd.set("category", category);

    startTransition(async () => {
      const result = await updatePlatformSetting({ success: false, error: false }, fd);
      if (result.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        toast.error(result.message ?? "Failed to save setting");
      }
    });
  }

  return (
    <div>
      <label className="block text-white/60 text-xs font-medium mb-1.5">{label}</label>
      <div className="flex gap-2">
        <input
          type={inputType}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/80 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all"
        />
        <button
          onClick={handleSave}
          disabled={isPending || value === currentValue}
          className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40 flex items-center gap-1.5 ${
            saved
              ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
              : "bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30"
          }`}
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}
