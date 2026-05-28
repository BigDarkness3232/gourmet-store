"use client"

import { useState } from "react"
import { X, Loader2 } from "lucide-react"
import { Role } from "@prisma/client"

type User = {
  id?: string
  name: string
  email: string
  password?: string
  role: Role
}

interface Props {
  user?: User | null
  onClose: () => void
  onSaved: () => void
}

const empty: User = { name: "", email: "", password: "", role: "INVENTARIO" }

const roles: { value: Role; label: string }[] = [
  { value: "ADMIN",      label: "Administrador" },
  { value: "REPARTIDOR", label: "Repartidor" },
  { value: "INVENTARIO", label: "Gestor de Inventario" },
]

export default function UsuarioModal({ user, onClose, onSaved }: Props) {
  const [form, setForm]     = useState<User>(user ?? empty)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      setError("Nombre y email son requeridos")
      return
    }
    if (!form.id && !form.password) {
      setError("La contraseña es requerida para nuevos usuarios")
      return
    }
    setLoading(true)
    setError("")

    const url    = form.id ? `/api/admin/usuarios/${form.id}` : "/api/admin/usuarios"
    const method = form.id ? "PATCH" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
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
            {form.id ? "Editar usuario" : "Nuevo usuario"}
          </h2>
          <button onClick={onClose} className="text-blue-700/40 hover:text-sky-500 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-4">
          {error && (
            <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-500">{error}</p>
          )}

          <Field label="Nombre completo" name="name"  value={form.name}  onChange={handleChange} />
          <Field label="Email"           name="email" value={form.email} onChange={handleChange} type="email" />

          {!form.id && (
            <Field label="Contraseña" name="password" value={form.password ?? ""} onChange={handleChange} type="password" />
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-blue-800">Rol</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-blue-900 outline-none focus:ring-2 focus:ring-sky-300"
            >
              {roles.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
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
            {form.id ? "Guardar cambios" : "Crear usuario"}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, name, value, type = "text", onChange }: {
  label: string; name: string; value: string
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