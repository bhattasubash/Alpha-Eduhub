import { redirect } from "next/navigation";
import { Settings } from "lucide-react";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/getRole";
import PlatformSettingsForm from "@/components/super-admin/PlatformSettingsForm";

export const dynamic = 'force-dynamic';

const DEFAULT_SETTINGS = [
  { key: "platform_name",     label: "Platform Name",     category: "general", defaultValue: "Alpha Edu Hub",           type: "text"  },
  { key: "platform_tagline",  label: "Platform Tagline",  category: "general", defaultValue: "Smart Schools. Smarter Future.", type: "text" },
  { key: "support_email",     label: "Support Email",     category: "general", defaultValue: "support@alphaedu.com",    type: "email" },
  { key: "max_schools",       label: "Max Schools",       category: "general", defaultValue: "1000",                    type: "number"},
  { key: "smtp_host",         label: "SMTP Host",         category: "smtp",    defaultValue: "smtp.gmail.com",          type: "text"  },
  { key: "smtp_port",         label: "SMTP Port",         category: "smtp",    defaultValue: "587",                     type: "number"},
  { key: "smtp_user",         label: "SMTP Username",     category: "smtp",    defaultValue: "",                        type: "text"  },
  { key: "smtp_from",         label: "From Email",        category: "smtp",    defaultValue: "noreply@alphaedu.com",    type: "email" },
  { key: "cloudinary_cloud",  label: "Cloudinary Cloud",  category: "storage", defaultValue: "",                        type: "text"  },
  { key: "cloudinary_preset", label: "Upload Preset",     category: "storage", defaultValue: "",                        type: "text"  },
  { key: "max_upload_mb",     label: "Max Upload (MB)",   category: "storage", defaultValue: "10",                      type: "number"},
  { key: "jwt_expiry_min",    label: "JWT Expiry (min)",  category: "security",defaultValue: "15",                      type: "number"},
  { key: "max_login_attempts",label: "Max Login Attempts",category: "security",defaultValue: "5",                       type: "number"},
  { key: "maintenance_mode",  label: "Maintenance Mode",  category: "security",defaultValue: "false",                   type: "text"  },
];

export default async function SettingsPage() {
  try {
    await requireSession(["SUPER_ADMIN"]);
  } catch {
    redirect("/sign-in");
  }

  // Load all existing settings
  const storedSettings = await prisma.platformSetting.findMany();
  const settingsMap: Record<string, string> = {};
  storedSettings.forEach((s) => { settingsMap[s.key] = s.value; });

  const settingsByCategory = DEFAULT_SETTINGS.reduce<Record<string, typeof DEFAULT_SETTINGS>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  const categoryLabels: Record<string, string> = {
    general:  "⚙️ General",
    smtp:     "📧 Email / SMTP",
    storage:  "☁️ Storage",
    security: "🔒 Security",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
        <p className="text-white/40 text-sm mt-0.5">Configure the global platform behavior</p>
      </div>

      {Object.entries(settingsByCategory).map(([category, settings]) => (
        <div key={category} className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <h2 className="text-white font-semibold text-lg mb-5">
            {categoryLabels[category] ?? category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {settings.map((setting) => (
              <PlatformSettingsForm
                key={setting.key}
                settingKey={setting.key}
                label={setting.label}
                category={setting.category}
                currentValue={settingsMap[setting.key] ?? setting.defaultValue}
                inputType={setting.type}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
