import { Skeleton } from '@/components/ui/skeleton';

export function ModuleSkeleton() {
  return (
    <div className="space-y-8 p-2" aria-busy="true" aria-label="Loading module…">
      {/* Header */}
      <div className="space-y-3">
        <Skeleton className="h-3 w-24 rounded-full" />
        <Skeleton className="h-10 w-64" />
      </div>
      {/* Cards row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-surface-container-low p-5 space-y-3">
            <Skeleton className="h-9 w-9 rounded-xl" />
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-3 w-24 rounded-full" />
          </div>
        ))}
      </div>
      {/* List */}
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-2xl bg-surface-container-low p-6 flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2 rounded-full" />
          </div>
          <Skeleton className="h-8 w-20 rounded-xl" />
        </div>
      ))}
    </div>
  );
}

export function ChildCardSkeleton() {
  return (
    <div className="rounded-2xl bg-surface-container-low p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-3 w-20 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
      </div>
    </div>
  );
}
