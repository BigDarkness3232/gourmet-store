"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { ProductDTO } from "@/types"

interface Props {
  product: ProductDTO
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart()

  const formattedPrice = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(product.price)

  return (
    <div className="group flex flex-col rounded-2xl border border-sky-100 bg-white shadow-sm transition hover:shadow-md">
      {/* Imagen */}
      <Link href={`/productos/${product.id}`} className="relative h-52 w-full overflow-hidden rounded-t-2xl">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-sky-500 px-2 py-0.5 text-xs font-semibold text-white">
            Destacado
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-sky-400">
          {product.category.name}
        </span>

        <Link href={`/productos/${product.id}`}>
          <h3 className="font-semibold text-blue-900 transition hover:text-sky-500">
            {product.name}
          </h3>
        </Link>

        <p className="line-clamp-2 text-sm text-blue-700/70">
          {product.description}
        </p>

        {/* Precio + botón */}
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-lg font-bold text-blue-900">{formattedPrice}</span>

          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="flex items-center gap-2 rounded-xl bg-sky-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-4 w-4" />
            {product.stock === 0 ? "Sin stock" : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  )
}