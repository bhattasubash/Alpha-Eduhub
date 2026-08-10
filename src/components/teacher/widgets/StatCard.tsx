import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
  iconColor?: string;
  bgColor?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
  iconColor = "text-indigo-600",
  bgColor = "bg-indigo-50",
}: StatCardProps) {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 hover:shadow-lg hover-lift animate-fade-in",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2">
              {title}
            </p>
            <h3 className="text-2xl font-bold text-gray-900">
              {value}
            </h3>
            {trend && (
              <div className="flex items-center gap-2 mt-3">
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.positive ? "text-green-600" : "text-red-600"
                  )}
                >
                  {trend.positive ? "+" : ""}
                  {trend.value}
                </span>
                <span className="text-xs text-gray-500">from last week</span>
              </div>
            )}
          </div>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-200 hover:scale-110 flex-shrink-0",
              bgColor
            )}
          >
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}