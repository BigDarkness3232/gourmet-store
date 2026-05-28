import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { PackageCheck, ChevronRight } from "lucide-react"

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

const statusIcons: Record<string, string> = {
  PENDIENTE: "🕐",
  PAGADO:    "✅",
  EN_CAMINO: "🚚",
  ENTREGADO: "🎉",
  CANCELADO: "❌",
}

export default async function MisOrdenesPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const ordenes = await prisma.order.findMany({
    where:   { userId: session.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  })

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(n)

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900">Mis pedidos</h1>
        <p className="mt-1 text-blue-700/60">Hola, {session.user.name} 👋</p>
      </div>

      {ordenes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-sky-100 bg-white py-20 text-center shadow-sm">
          <PackageCheck className="h-12 w-12 text-sky-300" />
          <p className="text-blue-700/60">Aún no tienes pedidos.</p>
          <Link
            href="/productos"
            className="rounded-xl bg-sky-500 px-6 py-2 text-sm font-semibold text-white hover:bg-sky-600 transition"
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {ordenes.map((orden) => (
            <div key={orden.id} className="rounded-2xl border border-sky-100 bg-white shadow-sm overflow-hidden">

              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sky-100 px-5 py-4">
                <div>
                  <p className="text-xs text-blue-700/50 mb-1">
                    {new Date(orden.createdAt).toLocaleDateString("es-CL", {
                      day: "numeric", month: "long", year: "numeric"
                    })}
                  </p>
                  <p className="text-sm font-medium text-blue-900">
                    Orden #{orden.buyOrder}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-blue-900">
                    {formatPrice(orden.total)}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[orden.status]}`}>
                    {statusIcons[orden.status]} {statusLabels[orden.status]}
                  </span>
                </div>
              </div>

              {/* Productos */}
              <div className="px-5 py-4 flex flex-col gap-2">
                {orden.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm text-blue-800">
                    <span className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 text-sky-400" />
                      {item.product.name} x{item.quantity}
                    </span>
                    <span className="font-medium">{formatPrice(item.unitPrice * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Dirección */}
              <div className="border-t border-sky-100 px-5 py-3 bg-sky-50">
                <p className="text-xs text-blue-700/50">
                  📍 {orden.direccion}, {orden.ciudad}, {orden.region}
                </p>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}