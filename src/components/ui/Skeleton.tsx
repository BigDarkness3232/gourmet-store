export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-xl bg-sky-100 ${className}`} />
  )
}

// ─── Card de producto skeleton ────────────────────────────────
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-sky-100 bg-white shadow-sm overflow-hidden">
      <Skeleton className="h-52 w-full rounded-none" />
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <div className="mt-2 flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    </div>
  )
}

// ─── Grid de productos skeleton ───────────────────────────────
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

// ─── Hero skeleton ────────────────────────────────────────────
export function HeroSkeleton() {
  return (
    <div className="flex min-h-[480px] flex-col items-center justify-center gap-4 bg-gradient-to-br from-blue-900 via-blue-800 to-sky-600 px-4">
      <Skeleton className="h-4 w-48 bg-blue-700" />
      <Skeleton className="h-10 w-96 bg-blue-700" />
      <Skeleton className="h-4 w-80 bg-blue-700" />
      <div className="flex gap-4 mt-4">
        <Skeleton className="h-12 w-36 bg-blue-700" />
        <Skeleton className="h-12 w-36 bg-blue-700" />
      </div>
    </div>
  )
}

// ─── Categorías skeleton ──────────────────────────────────────
export function CategoriesSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-20" />
      ))}
    </div>
  )
}