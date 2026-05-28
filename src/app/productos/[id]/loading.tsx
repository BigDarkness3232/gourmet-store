import { Skeleton, ProductGridSkeleton } from "@/components/ui/Skeleton"

export default function ProductoDetalleLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Skeleton className="mb-8 h-4 w-36" />

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* Imagen */}
        <Skeleton className="h-80 w-full md:h-[420px]" />

        {/* Info */}
        <div className="flex flex-col gap-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <Skeleton className="h-9 w-32 mt-2" />
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-12 w-full mt-4" />
        </div>
      </div>

      {/* Relacionados */}
      <div className="mt-20">
        <Skeleton className="mb-6 h-7 w-52" />
        <ProductGridSkeleton count={4} />
      </div>
    </div>
  )
}