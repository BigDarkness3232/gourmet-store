"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Pencil, Trash2, Loader2, Tag } from "lucide-react"
import CategoriaModal from "@/components/admin/CategoriaModal"

type Category = {
  id: string
  name: string
  slug: string
  _count: { products: number }
  createdAt: string
}

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading]       = useState(true)
  const [modal, setModal]           = useState<"create" | "edit" | null>(null)
  const [selected, setSelected]     = useState<Category | null>(null)
  const [deleting, setDeleting]     = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    const res = await fetch("/api/admin/categorias")
    const data = await res.json()
    setCategories(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchCategories() }, [fetchCategories])

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta categoría? Los productos asociados quedarán sin categoría.")) return
    setDeleting(id)
    const res = await fetch(`/api/admin/categorias/${id}`, { method: "DELETE" })
    if (res.ok) setCategories((prev) => prev.filter((c) => c.id !== id))
    else alert("No se puede eliminar una categoría con productos asociados")
    setDeleting(null)
  }

  return (
    <>
      {modal && (
        <CategoriaModal
          category={modal === "edit" ? selected : null}
          onClose={() => { setModal(null); setSelected(null) }}
          onSaved={fetchCategories}
        />
      )}

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-900">Categorías</h1>
            <p className="text-blue-700/60 text-sm mt-1">Gestión de categorías de productos</p>
          </div>
          <button
            onClick={() => setModal("create")}
            className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 transition"
          >
            <Plus className="h-4 w-4" />
            Nueva categoría
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-blue-700/50">
            <Loader2 className="h-6 w-6 animate-spin mr-2" /> Cargando...
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-sky-100 bg-white py-20 text-center shadow-sm">
            <Tag className="h-12 w-12 text-sky-300" />
            <p className="text-blue-700/50">No hay categorías aún.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((cat) => (
              <div key={cat.id} className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm flex items-center justify-between">
                <div>
                  <p className="font-semibold text-blue-900">{cat.name}</p>
                  <p className="text-xs text-blue-700/50 mt-0.5">/{cat.slug}</p>
                  <p className="text-xs text-sky-500 mt-1">{cat._count.products} productos</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setSelected(cat); setModal("edit") }}
                    className="rounded-lg bg-sky-50 p-1.5 text-sky-500 hover:bg-sky-100 transition"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    disabled={deleting === cat.id || cat._count.products > 0}
                    className="rounded-lg bg-red-50 p-1.5 text-red-400 hover:bg-red-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    title={cat._count.products > 0 ? "No puedes eliminar una categoría con productos" : "Eliminar"}
                  >
                    {deleting === cat.id
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <Trash2 className="h-4 w-4" />
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}