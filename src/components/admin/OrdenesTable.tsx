"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { Role } from "@prisma/client"

type OrderItem = {
  id: string
  quantity: number
  unitPrice: number
  product: { name: string }
}

type Order = {
  id: string
  status: string
  total: number
  buyOrder: string
  nombre: string
  email: string
  telefono: string
  direccion: string
  ciudad: string
  region: string
  createdAt: Date
  items: OrderItem[]
}

interface Props {
  ordenes: Order[]
  role: Role
}

const statusLabels: Record<string, string> = {
  PENDIENTE: "Pendiente",
  PAGADO:    "Pagado",
  EN_CAMINO: "En camino",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
}

const statusColors: Record<string, string> = {
  PENDIENTE: "bg-yellow-100 text-yellow-700",
  PAGADO:    "bg-blue-100 text-blue-700",
  EN_CAMINO: "bg-sky-100 text-sky-700",
  ENTREGADO: "bg-green-100 text-green-700",
  CANCELADO: "bg-red-100 text-red-700",
}

// Transiciones permitidas por rol
const nextStatus: Record<string, string> = {
  PAGADO:    "EN_CAMINO",
  EN_CAMINO: "ENTREGADO",
}

const nextStatusLabel: Record<string, string> = {
  PAGADO:    "Marcar en camino",
  EN_CAMINO: "Marcar entregado",
}

export default function OrdenesTable({ ordenes, role }: Props) {
  const [expanded, setExpanded]   = useState<string | null>(null)
  const [loading, setLoading]     = useState<string | null>(null)
  const [items, setItems]         = useState<Order[]>(ordenes)

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(n)

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setLoading(orderId)
    try {
      const res = await fetch(`/api/admin/ordenes/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setItems((prev) =>
          prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o)
        )
      }
    } finally {
      setLoading(null)
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-sky-100 p-10 text-center text-blue-700/50 shadow-sm">
        No hay órdenes aún.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((o) => (
        <div key={o.id} className="rounded-2xl bg-white border border-sky-100 shadow-sm overflow-hidden">

          {/* Fila principal */}
          <div className="flex flex-wrap items-center gap-4 p-4">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-blue-900 truncate">{o.nombre}</p>
              <p className="text-xs text-blue-700/50">{o.email} · {o.ciudad}, {o.region}</p>
            </div>

            <div className="text-right">
              <p className="font-bold text-blue-900">{formatPrice(o.total)}</p>
              <p className="text-xs text-blue-700/50">
                {new Date(o.createdAt).toLocaleDateString("es-CL")}
              </p>
            </div>

            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[o.status]}`}>
              {statusLabels[o.status]}
            </span>

            {/* Botón cambio de estado (ADMIN y REPARTIDOR) */}
            {(role === "ADMIN" || role === "REPARTIDOR") && nextStatus[o.status] && (
              <button
                onClick={() => handleStatusChange(o.id, nextStatus[o.status])}
                disabled={loading === o.id}
                className="flex items-center gap-2 rounded-xl bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-600 transition disabled:opacity-60"
              >
                {loading === o.id
                  ? <Loader2 className="h-3 w-3 animate-spin" />
                  : nextStatusLabel[o.status]
                }
              </button>
            )}

            {/* Expandir */}
            <button
              onClick={() => setExpanded(expanded === o.id ? null : o.id)}
              className="text-blue-700/40 hover:text-sky-500 transition"
            >
              {expanded === o.id
                ? <ChevronUp className="h-5 w-5" />
                : <ChevronDown className="h-5 w-5" />
              }
            </button>
          </div>

          {/* Detalle expandible */}
          {expanded === o.id && (
            <div className="border-t border-sky-100 px-4 py-4 bg-sky-50">
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-400 mb-3">
                Productos
              </p>
              <div className="flex flex-col gap-2">
                {o.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-blue-800">
                    <span>{item.product.name} x{item.quantity}</span>
                    <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-sky-200 flex justify-between text-sm font-bold text-blue-900">
                <span>Total</span>
                <span>{formatPrice(o.total)}</span>
              </div>
              <div className="mt-3 text-xs text-blue-700/50">
                <p>📞 {o.telefono}</p>
                <p>📍 {o.direccion}, {o.ciudad}, {o.region}</p>
                <p>🧾 Orden Webpay: {o.buyOrder}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}