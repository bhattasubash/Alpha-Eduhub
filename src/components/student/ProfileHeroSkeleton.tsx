import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileHeroSkeleton() {
  return (
    <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl">
      <div className="relative p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar Skeleton */}
          <Skeleton className="h-20 w-20 md:h-24 md:w-24 rounded-full" />

          {/* Info Skeleton */}
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-48 rounded-md" />
            <Skeleton className="h-4 w-64 rounded-md" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>

          {/* Actions Skeleton */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
