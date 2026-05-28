"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import UsuarioModal from "@/components/admin/UsuarioModal"
import ConfirmModal from "@/components/admin/ConfirmModal"
import { Role } from "@prisma/client"

type User = {
  id: string
  name: string
  email: string
  role: Role
  createdAt: string
}

const roleLabels: Record<Role, string> = {
  ADMIN:      "Administrador",
  REPARTIDOR: "Repartidor",
  INVENTARIO: "Gestor de Inventario",
  CLIENTE:    "Cliente",
}

const roleColors: Record<Role, string> = {
  ADMIN:      "bg-blue-100 text-blue-700",
  REPARTIDOR: "bg-sky-100 text-sky-700",
  INVENTARIO: "bg-indigo-100 text-indigo-700",
  CLIENTE:    "bg-green-100 text-green-700",
}

export default function UsuariosPage() {
  const [tab, setTab]           = useState<"panel" | "clientes">("panel")
  const [users, setUsers]       = useState<User[]>([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState<"create" | "edit" | null>(null)
  const [selected, setSelected] = useState<User | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/usuarios?tipo=${tab}`)
    const data = await res.json()
    setUsers(data)
    setLoading(false)
  }, [tab])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handleDelete = async (id: string) => {
    setDeleting(id)
    await fetch(`/api/admin/usuarios/${id}`, { method: "DELETE" })
    setUsers((prev) => prev.filter((u) => u.id !== id))
    setConfirmId(null)
    setDeleting(null)
  }

  return (
    <>
      {modal && tab === "panel" && (
        <UsuarioModal
          user={modal === "edit" ? selected : null}
          onClose={() => { setModal(null); setSelected(null) }}
          onSaved={fetchUsers}
        />
      )}

      {confirmId && (
        <ConfirmModal
          title="¿Eliminar usuario?"
          message="Esta acción no se puede deshacer. El usuario será eliminado permanentemente."
          loading={deleting === confirmId}
          onConfirm={() => handleDelete(confirmId)}
          onCancel={() => setConfirmId(null)}
        />
      )}

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-900">Usuarios</h1>
            <p className="text-blue-700/60 text-sm mt-1">Gestión de usuarios</p>
          </div>
          {tab === "panel" && (
            <button
              onClick={() => setModal("create")}
              className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 transition"
            >
              <Plus className="h-4 w-4" />
              Nuevo usuario
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab("panel")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              tab === "panel"
                ? "bg-blue-900 text-white"
                : "bg-white border border-sky-200 text-blue-800 hover:border-sky-400"
            }`}
          >
            Usuarios del panel
          </button>
          <button
            onClick={() => setTab("clientes")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              tab === "clientes"
                ? "bg-blue-900 text-white"
                : "bg-white border border-sky-200 text-blue-800 hover:border-sky-400"
            }`}
          >
            Clientes
          </button>
        </div>

        <div className="rounded-2xl bg-white border border-sky-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-blue-700/50">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Cargando...
            </div>
          ) : users.length === 0 ? (
            <div className="py-20 text-center text-blue-700/50">
              No hay {tab === "clientes" ? "clientes" : "usuarios"} aún.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sky-100 bg-sky-50 text-xs font-semibold uppercase tracking-wide text-sky-400">
                    <th className="px-4 py-3 text-left">Nombre</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Rol</th>
                    <th className="px-4 py-3 text-left">Creado</th>
                    <th className="px-4 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-sky-50 last:border-0 hover:bg-sky-50/50 transition">
                      <td className="px-4 py-3 font-medium text-blue-900">{u.name}</td>
                      <td className="px-4 py-3 text-blue-700/60">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${roleColors[u.role]}`}>
                          {roleLabels[u.role]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-blue-700/50 text-xs">
                        {new Date(u.createdAt).toLocaleDateString("es-CL")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          {tab === "panel" && (
                            <button
                              onClick={() => { setSelected(u); setModal("edit") }}
                              className="rounded-lg bg-sky-50 p-1.5 text-sky-500 hover:bg-sky-100 transition"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setConfirmId(u.id)}
                            disabled={deleting === u.id}
                            className="rounded-lg bg-red-50 p-1.5 text-red-400 hover:bg-red-100 transition disabled:opacity-60"
                          >
                            {deleting === u.id
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
          )}
        </div>
      </div>
    </>
  )
}