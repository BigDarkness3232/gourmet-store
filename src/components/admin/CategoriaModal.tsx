"use client"

import { useState } from "react"
import { X, Loader2 } from "lucide-react"

type Category = {
  id?: string
  name: string
  slug: string
}

interface Props {
  category?: Category | null
  onClose: () => void
  onSaved: () => void
}

const empty: Category = { name: "", slug: "" }

export default function CategoriaModal({ category, onClose, onSaved }: Props) {
  const [form, setForm]     = useState<Category>(category ?? empty)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState("")

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    const slug = name.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quitar tildes
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
    setForm({ ...form, name, slug })
  }

  const handleSubmit = async () => {
    if (!form.name || !form.slug) {
      setError("Nombre y slug son requeridos")
      return
    }
    setLoading(true)
    setError("")

    const url    = form.id ? `/api/admin/categorias/${form.id}` : "/api/admin/categorias"
    const method = form.id ? "PATCH" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, slug: form.slug }),
    })

    if (res.ok) {
      onSaved()
      onClose()
    } else {
      const data = await res.json()
      setError(data.error ?? "Error al guardar")
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b border-sky-100 px-6 py-4">
          <h2 className="font-bold text-blue-900">
            {form.id ? "Editar categoría" : "Nueva categoría"}
          </h2>
          <button onClick={onClose} className="text-blue-700/40 hover:text-sky-500 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-4">
          {error && (
            <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-500">{error}</p>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-blue-800">Nombre</label>
            <input
              type="text"
              value={form.name}
              onChange={handleNameChange}
              placeholder="Ej: Aceites & Vinagretas"
              className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-blue-900 outline-none focus:ring-2 focus:ring-sky-300"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-blue-800">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="aceites-vinagretas"
              className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-blue-900 outline-none focus:ring-2 focus:ring-sky-300"
            />
            <p className="text-xs text-blue-700/40">Se genera automáticamente desde el nombre</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-sky-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-sky-200 px-4 py-2 text-sm font-medium text-blue-800 hover:border-sky-400 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 transition disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {form.id ? "Guardar cambios" : "Crear categoría"}
          </button>
        </div>
      </div>
    </div>
  )
}