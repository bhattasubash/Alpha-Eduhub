import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title:      string;
  value:      string | number;
  subtitle?:  string;
  icon:       LucideIcon;
  change?:    { value: number; label: string };
  gradient:   string;       // e.g. "from-purple-600 to-indigo-600"
  iconBg?:    string;
  glass?:     boolean;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  change,
  gradient,
  glass = true,
}: StatCardProps) {
  const positive = (change?.value ?? 0) >= 0;

  return (
    <div
      className={`
        relative rounded-2xl p-5 overflow-hidden
        ${glass
          ? "bg-white/5 border border-white/10 backdrop-blur-sm"
          : `bg-gradient-to-br ${gradient} shadow-xl`
        }
      `}
    >
      {/* Background glow */}
      <div
        className={`absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${gradient}`}
      />

      <div className="relative">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>

          {change && (
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold
                ${positive
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-red-500/15 text-red-400"
                }
              `}
            >
              {positive
                ? <TrendingUp className="w-3 h-3" />
                : <TrendingDown className="w-3 h-3" />
              }
              {Math.abs(change.value)}%
            </div>
          )}
        </div>

        {/* Value */}
        <p className="text-2xl font-bold text-white mb-1">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>

        {/* Title */}
        <p className="text-white/50 text-sm font-medium">{title}</p>

        {/* Subtitle / change label */}
        {(subtitle || change?.label) && (
          <p className="text-white/30 text-xs mt-1">{subtitle ?? change?.label}</p>
        )}
      </div>
    </div>
  );
}
