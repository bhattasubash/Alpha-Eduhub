import { Trophy, Star, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BehaviourItem {
  id: string;
  type: "achievement" | "positive" | "observation" | "discipline";
  title: string;
  description: string;
  date: string;
  teacher?: string;
}

interface BehaviourTimelineProps {
  items: BehaviourItem[];
}

export default function BehaviourTimeline({ items }: BehaviourTimelineProps) {
  const typeConfig = {
    achievement: {
      icon: Trophy,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950",
      borderColor: "border-amber-200 dark:border-amber-800",
    },
    positive: {
      icon: Star,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
      borderColor: "border-emerald-200 dark:border-emerald-800",
    },
    observation: {
      icon: FileText,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    discipline: {
      icon: AlertTriangle,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950",
      borderColor: "border-red-200 dark:border-red-800",
    },
  };

  if (!items || items.length === 0) {
    return (
      <Card className="border-slate-200 dark:border-slate-700">
        <CardContent className="p-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-400">No behaviour records yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const config = typeConfig[item.type];
        const Icon = config.icon;

        return (
          <div key={item.id} className="relative pl-8">
            {/* Timeline connector */}
            {index !== items.length - 1 && (
              <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
            )}
            
            {/* Timeline dot */}
            <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500" />
            </div>

            <Card className={cn("border-slate-200 dark:border-slate-700", config.borderColor)}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${config.bgColor}`}>
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-50 text-sm">
                        {item.title}
                      </h4>
                      <span className="text-xs text-slate-500 dark:text-slate-500 whitespace-nowrap">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {item.description}
                    </p>
                    {item.teacher && (
                      <div className="text-xs text-slate-500 dark:text-slate-500">
                        Recorded by {item.teacher}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
