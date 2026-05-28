import { HeroSkeleton, CategoriesSkeleton, ProductGridSkeleton } from "@/components/ui/Skeleton"

export default function HomeLoading() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <HeroSkeleton />

      <section className="mx-auto w-full max-w-6xl px-4">
        <div className="mb-6 h-7 w-36 animate-pulse rounded-xl bg-sky-100" />
        <CategoriesSkeleton />
      </section>

      <section className="mx-auto w-full max-w-6xl px-4">
        <div className="mb-6 h-7 w-52 animate-pulse rounded-xl bg-sky-100" />
        <ProductGridSkeleton count={4} />
      </section>
    </div>
  )
}