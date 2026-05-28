"use client"

import { useState } from "react"
import Image from "next/image"
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react"
import ProductoModal from "./ProductoModal"
import ConfirmModal from "./ConfirmModal"

type Product = {
  id: string
  name: string
  image: string
  price: number
  stock: number
  featured: boolean
  description: string
  categoryId: string
  category: { id: string; name: string; slug: string }
}

interface Props {
  productos: Product[]
}

export default function InventarioTable({ productos }: Props) {
  const [items, setItems]         = useState<Product[]>(productos)
  const [modal, setModal]         = useState<"create" | "edit" | null>(null)
  const [selected, setSelected]   = useState<Product | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [deleting, setDeleting]   = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState("")

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(n)

  const handleSaved = async () => {
    const res = await fetch("/api/productos")
    const data = await res.json()
    setItems(data)
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    setDeleteError("")
    const res = await fetch(`/api/admin/productos/${id}`, { method: "DELETE" })
    if (res.ok) {
      setItems((prev) => prev.filter((p) => p.id !== id))
    } else {
      const data = await res.json()
      setDeleteError(data.error ?? "Error al eliminar")
    }
    setConfirmId(null)
    setDeleting(null)
  }

  return (
    <>
      {/* Modal crear/editar */}
      {modal && (
        <ProductoModal
          product={modal === "edit" ? selected : null}
          onClose={() => { setModal(null); setSelected(null) }}
          onSaved={handleSaved}
        />
      )}

      {/* Modal confirmar eliminar */}
      {confirmId && (
        <ConfirmModal
          title="¿Eliminar producto?"
          message="Esta acción no se puede deshacer. El producto será eliminado permanentemente."
          loading={deleting === confirmId}
          onConfirm={() => handleDelete(confirmId)}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {/* Error al eliminar */}
      {deleteError && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-500">
          {deleteError}
        </div>
      )}

      {/* Botón nuevo producto */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => { setSelected(null); setModal("create") }}
          className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 transition"
        >
          <Plus className="h-4 w-4" />
          Nuevo producto
        </button>
      </div>

      {/* Tabla */}
      <div className="rounded-2xl bg-white border border-sky-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sky-100 bg-sky-50 text-xs font-semibold uppercase tracking-wide text-sky-400">
                <th className="px-4 py-3 text-left">Producto</th>
                <th className="px-4 py-3 text-left">Categoría</th>
                <th className="px-4 py-3 text-right">Precio</th>
                <th className="px-4 py-3 text-right">Stock</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-b border-sky-50 last:border-0 hover:bg-sky-50/50 transition">

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                        <Image src={p.image} alt={p.name} fill className="object-cover" />
                      </div>
                      <span className="font-medium text-blue-900 line-clamp-1">{p.name}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-blue-700/60">{p.category.name}</td>

                  <td className="px-4 py-3 text-right font-semibold text-blue-900">
                    {formatPrice(p.price)}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <span className={`font-semibold ${p.stock <= 5 ? "text-red-500" : "text-blue-900"}`}>
                      {p.stock}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    {p.stock === 0 ? (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">Sin stock</span>
                    ) : p.stock <= 5 ? (
                      <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-700">Stock bajo</span>
                    ) : (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">Disponible</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => { setSelected(p); setModal("edit") }}
                        className="rounded-lg bg-sky-50 p-1.5 text-sky-500 hover:bg-sky-100 transition"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setConfirmId(p.id)}
                        disabled={deleting === p.id}
                        className="rounded-lg bg-red-50 p-1.5 text-red-400 hover:bg-red-100 transition disabled:opacity-60"
                      >
                        {deleting === p.id
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <Trash2 className="h-4 w-4" />
                        }
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}