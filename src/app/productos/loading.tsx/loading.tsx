import { ProductGridSkeleton, Skeleton } from "@/components/ui/Skeleton"

export default function ProductosLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Encabezado */}
      <div className="mb-8">
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Filtros */}
      <div className="mb-8 flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24" />
        ))}
      </div>

      {/* Grid */}
      <ProductGridSkeleton count={8} />
    </div>
  )
}