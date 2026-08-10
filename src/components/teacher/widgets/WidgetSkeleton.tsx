import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface WidgetSkeletonProps {
  items?: number;
}

export default function WidgetSkeleton({ items = 3 }: WidgetSkeletonProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-16" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: items }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-6 w-8" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}