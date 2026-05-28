import { prisma } from "@/lib/prisma"
import { ShoppingBag, Package, Users, TrendingUp } from "lucide-react"

async function getStats() {
  const [totalOrdenes, totalProductos, totalUsuarios, ordenes] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count({ where: { role: "CLIENTE" } }),
    prisma.order.findMany({
      where: { status: { in: ["PAGADO", "EN_CAMINO", "ENTREGADO"] } },
      select: { total: true, status: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ])

  const totalVentas = ordenes.reduce((sum, o) => sum + o.total, 0)

  return { totalOrdenes, totalProductos, totalUsuarios, totalVentas, ordenes }
}

export default async function DashboardPage() {
  const { totalOrdenes, totalProductos, totalUsuarios, totalVentas, ordenes } = await getStats()

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(n)

  const stats = [
    { label: "Ventas totales",  value: formatPrice(totalVentas), icon: TrendingUp,  color: "bg-sky-500" },
    { label: "Órdenes",         value: totalOrdenes,              icon: ShoppingBag, color: "bg-blue-500" },
    { label: "Productos",       value: totalProductos,            icon: Package,     color: "bg-indigo-500" },
    { label: "Clientes",        value: totalUsuarios,             icon: Users,       color: "bg-violet-500" },
  ]

  const statusLabels: Record<string, string> = {
    PENDIENTE:  "Pendiente",
    PAGADO:     "Pagado",
    EN_CAMINO:  "En camino",
    ENTREGADO:  "Entregado",
    CANCELADO:  "Cancelado",
  }

  const statusColors: Record<string, string> = {
    PENDIENTE:  "bg-yellow-100 text-yellow-700",
    PAGADO:     "bg-blue-100 text-blue-700",
    EN_CAMINO:  "bg-sky-100 text-sky-700",
    ENTREGADO:  "bg-green-100 text-green-700",
    CANCELADO:  "bg-red-100 text-red-700",
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-blue-900">Dashboard</h1>
        <p className="text-blue-700/60 text-sm mt-1">Resumen general de la tienda</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl bg-white border border-sky-100 p-5 shadow-sm flex items-center gap-4">
            <div className={`${color} rounded-xl p-3`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-blue-700/60 font-medium">{label}</p>
              <p className="text-xl font-bold text-blue-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Últimas órdenes */}
      <div className="rounded-2xl bg-white border border-sky-100 shadow-sm p-6">
        <h2 className="font-bold text-blue-900 mb-4">Últimas órdenes</h2>
        {ordenes.length === 0 ? (
          <p className="text-sm text-blue-700/50">No hay órdenes aún.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {ordenes.map((o, i) => (
              <div key={i} className="flex items-center justify-between text-sm border-b border-sky-50 pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-blue-900">{formatPrice(o.total)}</p>
                  <p className="text-xs text-blue-700/50">
                    {new Date(o.createdAt).toLocaleDateString("es-CL")}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[o.status]}`}>
                  {statusLabels[o.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}