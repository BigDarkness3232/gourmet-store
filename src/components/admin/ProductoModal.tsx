"use client"

import { useState, useEffect, useRef } from "react"
import { X, Loader2, Upload, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

type Category = { id: string; name: string; slug: string }

type Product = {
  id?: string
  name: string
  description: string
  price: number
  image: string
  stock: number
  featured: boolean
  categoryId: string
}

interface Props {
  product?: Product | null
  onClose: () => void
  onSaved: () => void
}

const empty: Product = {
  name: "", description: "", price: 0,
  image: "", stock: 0, featured: false, categoryId: "",
}

export default function ProductoModal({ product, onClose, onSaved }: Props) {
  const [form, setForm]             = useState<Product>(product ?? empty)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading]       = useState(false)
  const [uploading, setUploading]   = useState(false)
  const [error, setError]           = useState("")
  const fileRef                     = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch("/api/categorias").then((r) => r.json()).then(setCategories)
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    const res  = await fetch("/api/upload", { method: "POST", body: fd })
    const data = await res.json()
    if (data.url) setForm((prev) => ({ ...prev, image: data.url }))
    else setError("Error al subir la imagen")
    setUploading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : type === "number" ? Number(value) : value,
    }))
  }

  const handleSubmit = async () => {
    if (!form.name || !form.categoryId || !form.image) {
      setError("Nombre, categoría e imagen son requeridos")
      return
    }
    setLoading(true)
    setError("")

    const url    = form.id ? `/api/admin/productos/${form.id}` : "/api/admin/productos"
    const method = form.id ? "PATCH" : "POST"

    console.log("Enviando:", form)

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      onSaved()
      onClose()
    } else {
      setError("Error al guardar el producto")
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-sky-100 px-6 py-4">
          <h2 className="font-bold text-blue-900">
            {form.id ? "Editar producto" : "Nuevo producto"}
          </h2>
          <button onClick={onClose} className="text-blue-700/40 hover:text-sky-500 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 px-6 py-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-500">{error}</p>
          )}

          <Field label="Nombre" name="name" value={form.name} onChange={handleChange} />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-blue-800">Descripción</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-blue-900 outline-none focus:ring-2 focus:ring-sky-300 resize-none"
            />
          </div>

          {/* Imagen */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-blue-800">Imagen del producto</label>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <div
              onClick={() => fileRef.current?.click()}
              className="relative flex h-40 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-sky-200 bg-sky-50 hover:border-sky-400 transition"
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2 text-sky-400">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="text-xs">Subiendo imagen...</span>
                </div>
              ) : form.image ? (
                <Image src={form.image} alt="preview" fill className="object-cover rounded-xl" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-sky-400">
                  <ImageIcon className="h-8 w-8" />
                  <span className="text-xs font-medium">Click para subir imagen</span>
                </div>
              )}
            </div>
            {form.image && (
              <button
                onClick={() => setForm((prev) => ({ ...prev, image: "" }))}
                className="self-start text-xs text-red-400 hover:text-red-500 transition"
              >
                Quitar imagen
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Precio (CLP)" name="price" value={form.price} type="number" onChange={handleChange} />
            <Field label="Stock" name="stock" value={form.stock} type="number" onChange={handleChange} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-blue-800">Categoría</label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-blue-900 outline-none focus:ring-2 focus:ring-sky-300"
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-blue-800 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              className="h-4 w-4 accent-sky-500"
            />
            Producto destacado
          </label>
        </div>

        {/* Footer */}
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
            {form.id ? "Guardar cambios" : "Crear producto"}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, name, value, type = "text", onChange }: {
  label: string; name: string; value: string | number
  type?: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-blue-800">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-blue-900 outline-none focus:ring-2 focus:ring-sky-300"
      />
    </div>
  )
}