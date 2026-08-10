export default function StatCardSkeleton() {
  return (
    <div className="rounded-2xl p-5 bg-white/5 border border-white/10 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/10" />
        <div className="w-14 h-5 rounded-lg bg-white/10" />
      </div>
      <div className="w-20 h-7 rounded-lg bg-white/10 mb-2" />
      <div className="w-32 h-4 rounded bg-white/8 mb-1" />
      <div className="w-24 h-3 rounded bg-white/5" />
    </div>
  );
}
