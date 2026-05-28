"use client"

import { use, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, ArrowLeft, PackageCheck } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { ProductDTO } from "@/types"
import ProductGrid from "@/components/products/ProductGrid"

interface Props {
  params: Promise<{ id: string }>
}

export default function ProductoDetallePage({ params }: Props) {
  const { id } = use(params)
  const { addItem } = useCart()
  const [product, setProduct]   = useState<ProductDTO | null>(null)
  const [related, setRelated]   = useState<ProductDTO[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    fetch(`/api/productos/${id}`)
      .then((r) => r.json())
      .then((p) => {
        setProduct(p)
        return fetch(`/api/productos?categoria=${p.category.slug}`)
      })
      .then((r) => r.json())
      .then((all: ProductDTO[]) =>
        setRelated(all.filter((p) => p.id !== id && p.featured).slice(0, 4))
      )
      .finally(() => setLoading(false))
  }, [id])

  const formattedPrice = (price: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(price)

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center text-blue-700/50">Cargando...</div>
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-lg text-blue-800">Producto no encontrado.</p>
        <Link href="/productos" className="text-sky-500 underline hover:text-sky-600">
          Volver al catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Link href="/productos" className="mb-8 inline-flex items-center gap-2 text-sm text-blue-700 hover:text-sky-500 transition">
        <ArrowLeft className="h-4 w-4" />
        Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="relative h-80 w-full overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm md:h-[420px]">
          <Image src={product.image} alt={product.name} fill className="object-cover" />
          {product.featured && (
            <span className="absolute left-4 top-4 rounded-full bg-sky-500 px-3 py-1 text-xs font-semibold text-white">
              Destacado
            </span>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-sky-400">
            {product.category.name}
          </span>
          <h1 className="text-3xl font-bold text-blue-900">{product.name}</h1>
          <p className="text-blue-700/70 leading-relaxed">{product.description}</p>
          <p className="text-3xl font-bold text-blue-900">{formattedPrice(product.price)}</p>

          <div className="flex items-center gap-2 text-sm text-blue-700/60">
            <PackageCheck className="h-4 w-4 text-sky-400" />
            {product.stock > 0 ? `${product.stock} unidades disponibles` : "Sin stock disponible"}
          </div>

          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingCart className="h-5 w-5" />
            {product.stock === 0 ? "Sin stock" : "Agregar al carrito"}
          </button>

          <Link href="/carrito" className="text-center text-sm text-sky-500 underline hover:text-sky-600 transition">
            Ver mi carrito
          </Link>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <ProductGrid products={related} title="Productos relacionados" />
        </div>
      )}
    </div>
  )
}