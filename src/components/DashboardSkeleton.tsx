import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="dashboard-skeleton-card h-7 w-56" />
          <div className="dashboard-skeleton-card h-4 w-36" />
        </div>
        <div className="dashboard-skeleton-card h-9 w-28" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card border border-border/60 rounded-2xl p-5 space-y-4" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex items-center justify-between">
              <div className="dashboard-skeleton-card h-10 w-10" />
              <div className="dashboard-skeleton-card h-4 w-12" />
            </div>
            <div className="dashboard-skeleton-card h-9 w-16" />
            <div className="dashboard-skeleton-card h-3 w-24" />
          </div>
        ))}
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card border border-border/60 rounded-2xl p-4 space-y-3">
            <div className="dashboard-skeleton-card h-8 w-8" />
            <div className="dashboard-skeleton-card h-7 w-12" />
            <div className="dashboard-skeleton-card h-3 w-28" />
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-card border border-border/60 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2">
              <div className="dashboard-skeleton-card h-8 w-8" />
              <div className="dashboard-skeleton-card h-4 w-36" />
            </div>
            <div className="dashboard-skeleton-card h-48 w-full" />
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-card border border-border/60 rounded-2xl p-6 space-y-4">
        <div className="dashboard-skeleton-card h-4 w-28" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="dashboard-skeleton-card h-16 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
