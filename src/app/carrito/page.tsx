// src/app/carrito/page.tsx 
"use client"

import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { useCart } from "@/context/CartContext"

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart()

  const formattedPrice = (price: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(price)

  // Carrito vacío
  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4">
        <ShoppingBag className="h-16 w-16 text-sky-300" />
        <h2 className="text-2xl font-bold text-blue-900">Tu carrito está vacío</h2>
        <p className="text-blue-700/60">Agrega productos para comenzar tu compra.</p>
        <Link
          href="/productos"
          className="rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white transition hover:bg-sky-600"
        >
          Ver productos
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-blue-900">Mi carrito</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

        {/* Lista de productos */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          {items.map(({ id, product, quantity }) => (
            <div
              key={id}
              className="flex gap-4 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm"
            >
              {/* Imagen */}
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                <Image src={product.image} alt={product.name} fill className="object-cover" />
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col gap-1">
                <span className="text-xs font-medium uppercase tracking-wide text-sky-400">
                  {product.category.name}
                </span>
                <h3 className="font-semibold text-blue-900">{product.name}</h3>
                <p className="text-sm font-bold text-blue-900">
                  {formattedPrice(product.price)}
                </p>

                {/* Cantidad + eliminar */}
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-2 py-1">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="text-blue-700 hover:text-sky-500 transition"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-5 text-center text-sm font-semibold text-blue-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="text-blue-700 hover:text-sky-500 transition disabled:opacity-40"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(product.id)}
                    className="ml-auto text-red-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Vaciar carrito */}
          <button
            onClick={clearCart}
            className="self-start text-sm text-red-400 underline hover:text-red-500 transition"
          >
            Vaciar carrito
          </button>
        </div>

        {/* Resumen */}
        <div className="h-fit rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-blue-900">Resumen del pedido</h2>

          <div className="flex flex-col gap-2 text-sm text-blue-700">
            <div className="flex justify-between">
              <span>Productos ({totalItems})</span>
              <span>{formattedPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío</span>
              <span className="text-sky-500 font-medium">Por calcular</span>
            </div>
          </div>

          <div className="my-4 border-t border-sky-100" />

          <div className="flex justify-between font-bold text-blue-900">
            <span>Total</span>
            <span>{formattedPrice(totalPrice)}</span>
          </div>

          <Link
            href="/checkout"
            className="mt-6 flex w-full items-center justify-center rounded-xl bg-sky-500 py-3 font-semibold text-white transition hover:bg-sky-600"
          >
            Ir al checkout
          </Link>

          <Link
            href="/productos"
            className="mt-3 flex w-full items-center justify-center rounded-xl border border-sky-200 py-3 text-sm font-medium text-blue-800 transition hover:border-sky-400"
          >
            Seguir comprando
          </Link>
        </div>

      </div>
    </div>
  )
}
