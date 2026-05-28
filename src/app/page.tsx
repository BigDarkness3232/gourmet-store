import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title:       "Inicio",
  description: "Bienvenido a GourmetStore. Descubre nuestros productos artesanales seleccionados con pasión y calidad.",
}


import { prisma } from "@/lib/prisma"
import ProductGrid from "@/components/products/ProductGrid"

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    prisma.product.findMany({
      where:   { featured: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany(),
  ])

  return (
    <div className="flex flex-col gap-16 pb-20">

      {/* ── Hero ── */}
      <section className="relative flex min-h-[480px] flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-sky-600 px-4 text-center text-white">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-sky-300">
          Bienvenido a GourmetStore
        </p>
        <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
          Sabores que cuentan una historia
        </h1>
        <p className="mt-4 max-w-xl text-sky-200">
          Descubre nuestra selección de productos artesanales y gourmet, elaborados con los mejores ingredientes del mundo.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/productos"
            className="rounded-xl bg-sky-400 px-6 py-3 font-semibold text-white transition hover:bg-sky-300"
          >
            Ver productos
          </Link>
          <Link
            href="/productos"
            className="rounded-xl border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Conocer más
          </Link>
        </div>
      </section>

      {/* ── Categorías ── */}
      <section className="mx-auto w-full max-w-6xl px-4">
        <h2 className="mb-6 text-2xl font-bold text-blue-900">Categorías</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/productos?categoria=${cat.slug}`}
              className="flex items-center justify-center rounded-2xl border border-sky-100 bg-white py-6 text-sm font-semibold text-blue-800 shadow-sm transition hover:border-sky-300 hover:text-sky-500 hover:shadow-md"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Productos destacados ── */}
      <section className="mx-auto w-full max-w-6xl px-4">
        <ProductGrid products={featured} title="Productos Destacados" />
        <div className="mt-10 text-center">
          <Link
            href="/productos"
            className="inline-block rounded-xl bg-blue-900 px-8 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            Ver todos los productos
          </Link>
        </div>
      </section>

      {/* ── Banner CTA ── */}
      <section className="mx-auto w-full max-w-6xl px-4">
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-sky-500 px-8 py-12 text-center text-white sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h3 className="text-2xl font-bold">¿Primera compra?</h3>
            <p className="mt-1 text-sky-100">Descubre nuestros productos y vive la experiencia gourmet.</p>
          </div>
          <Link
            href="/productos"
            className="shrink-0 rounded-xl bg-white px-6 py-3 font-semibold text-sky-600 transition hover:bg-sky-50"
          >
            Explorar tienda
          </Link>
        </div>
      </section>

    </div>
  )
}